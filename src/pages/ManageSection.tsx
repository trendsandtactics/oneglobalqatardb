import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSiteContent, updatePageContent, SiteContent, defaultContent } from "@/pages/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, ArrowLeft, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import JsonFormField from "@/components/admin/JsonFormField";
import GlobalPresenceEditor from "@/components/admin/GlobalPresenceEditor";
import CountrySelectorEditor from "@/components/admin/CountrySelectorEditor";
import { set, cloneDeep } from 'lodash';

const formatLabel = (name: string) =>
  name.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());

// Sections rendered as one flat form without sub-tabs
const FLAT_SECTIONS = ['header', 'footer'];

const ManageSection = () => {
  const { sectionName } = useParams<{ sectionName: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editableContent, setEditableContent] = useState<any>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const { data: siteContent, isLoading } = useQuery<SiteContent>({
    queryKey: ["siteContent"],
    queryFn: getSiteContent,
  });

  const updateMutation = useMutation({
    mutationFn: ({ page, content }: { page: keyof SiteContent; content: any }) =>
      updatePageContent(page, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["siteContent"] });
      setIsDirty(false);
      toast.success("Content saved successfully!");
    },
    onError: () => {
      toast.error("Failed to save content.");
    },
  });

  useEffect(() => {
    if (siteContent && sectionName && sectionName in siteContent) {
      const content = cloneDeep(siteContent[sectionName as keyof SiteContent]);
      setEditableContent(content);
      const firstKey = Object.keys(content)[0];
      setActiveTab(firstKey ?? null);
      setIsDirty(false);
    }
  }, [siteContent, sectionName]);

  const handleFieldChange = (path: string, value: any) => {
    const newContent = cloneDeep(editableContent);
    const relativePath = path.substring(path.indexOf('.') + 1);
    set(newContent, relativePath, value);
    setEditableContent(newContent);
    setIsDirty(true);
  };

  const handleSave = () => {
    if (sectionName && editableContent) {
      updateMutation.mutate({ page: sectionName as keyof SiteContent, content: editableContent });
    }
  };

  const handleReset = () => {
    if (sectionName && sectionName in defaultContent) {
      const def = cloneDeep(defaultContent[sectionName as keyof typeof defaultContent]);
      setEditableContent(def);
      setIsDirty(true);
      toast.info("Reset to default — click Save to apply.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-navy" />
      </div>
    );
  }

  if (!sectionName || !editableContent) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Section not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/admin/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const isFlat = FLAT_SECTIONS.includes(sectionName);
  const subsections = Object.keys(editableContent);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-brand-navy">{formatLabel(sectionName)}</h1>
            <p className="text-sm text-gray-500">Edit page content</p>
          </div>
          {isDirty && (
            <Badge variant="secondary" className="text-orange-600 bg-orange-50 border-orange-200">
              Unsaved changes
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending || !isDirty}
            className="bg-brand-navy hover:bg-brand-navy/90 text-white"
          >
            {updateMutation.isPending ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</>
            ) : (
              <><Save className="h-4 w-4 mr-2" /> Save Changes</>
            )}
          </Button>
        </div>
      </div>

      {/* Subsection tabs — hidden for flat sections */}
      {!isFlat && subsections.length > 1 && (
        <div className="flex gap-1 mb-6 flex-wrap">
          {subsections.map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveTab(sub)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeTab === sub
                  ? 'bg-brand-navy text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {formatLabel(sub)}
            </button>
          ))}
        </div>
      )}

      {/* Flat sections (header/footer) — render entire object as one form, no sub-tabs */}
      {isFlat && (
        <Card className="mb-4">
          <CardContent className="pt-6">
            <JsonFormField
              data={editableContent}
              path={sectionName}
              onFieldChange={handleFieldChange}
            />
          </CardContent>
        </Card>
      )}

      {/* Render content by subsection */}
      {!isFlat && subsections.map((sub) => {
        if (activeTab && sub !== activeTab) return null;
        const subData = editableContent[sub];

        // Special editor: Global Presence locations + map
        if (sectionName === 'globalPresence' && sub === 'locations') {
          return (
            <Card key={sub} className="mb-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-gray-700">Countries & Offices</CardTitle>
              </CardHeader>
              <CardContent>
                <GlobalPresenceEditor
                  countries={editableContent.locations ?? []}
                  mapEmbedUrl={editableContent.mapEmbedUrl ?? ''}
                  onChange={(locations, mapEmbedUrl) => {
                    const newContent = { ...editableContent, locations, mapEmbedUrl };
                    setEditableContent(newContent);
                    setIsDirty(true);
                  }}
                />
              </CardContent>
            </Card>
          );
        }

        // Skip mapEmbedUrl as standalone — it's handled inside GlobalPresenceEditor
        if (sectionName === 'globalPresence' && sub === 'mapEmbedUrl') return null;

        // Special editor: Country Selector items
        if (sectionName === 'countrySelector' && sub === 'items') {
          return (
            <Card key={sub} className="mb-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-gray-700">Switch Country Links</CardTitle>
              </CardHeader>
              <CardContent>
                <CountrySelectorEditor
                  items={subData ?? []}
                  onChange={(items) => {
                    const newContent = { ...editableContent, items };
                    setEditableContent(newContent);
                    setIsDirty(true);
                  }}
                />
              </CardContent>
            </Card>
          );
        }

        // Default JSON form editor
        // Nested objects: render their fields directly (path = sectionName.sub)
        // Arrays or primitives: wrap with the sub key so the save path is correct
        const isNestedObject = typeof subData === 'object' && subData !== null && !Array.isArray(subData);
        return (
          <Card key={sub} className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-gray-700">
                {formatLabel(sub)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <JsonFormField
                data={isNestedObject ? subData : { [sub]: subData }}
                path={isNestedObject ? `${sectionName}.${sub}` : sectionName}
                onFieldChange={handleFieldChange}
              />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ManageSection;
