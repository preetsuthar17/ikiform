"use client";

import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { MetadataSectionProps } from "../types";

export function MetadataSection({
  localSettings,
  updateSettings,
}: MetadataSectionProps) {
  const metadata = localSettings.metadata || {};

  const updateMetadata = (updates: Partial<typeof metadata>) => {
    updateSettings({
      metadata: {
        ...metadata,
        ...updates,
      },
    });
  };

  const handleRobotsChange = (value: string) => {
    const robotsMap: Record<string, { noIndex?: boolean; noFollow?: boolean }> =
      {
        index: { noIndex: false, noFollow: false },
        noindex: { noIndex: true, noFollow: false },
        nofollow: { noIndex: false, noFollow: true },
        "noindex,nofollow": { noIndex: true, noFollow: true },
      };

    const robotsValue = robotsMap[value];
    if (robotsValue) {
      updateMetadata({
        robots: value as any,
        ...robotsValue,
      });
    }
  };

  const getRobotsValue = () => {
    if (metadata.noIndex && metadata.noFollow) return "noindex,nofollow";
    if (metadata.noIndex) return "noindex";
    if (metadata.noFollow) return "nofollow";
    return "index";
  };

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-3">
        <Search className="h-5 w-5 text-primary" />
        <h3 className="font-medium text-lg">Metadata & SEO</h3>
      </div>
      <div className="flex flex-col gap-4">
        {/* Basic SEO Settings */}
        <div className="flex flex-col gap-4 border-muted border-l-2 pl-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="meta-title">Page Title</Label>
            <Input
              id="meta-title"
              maxLength={60}
              onChange={(e) => updateMetadata({ title: e.target.value })}
              placeholder="Enter page title (max 60 characters)"
              value={metadata.title || ""}
            />
            <p className="text-muted-foreground text-xs">
              {metadata.title?.length || 0}/60 characters
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="meta-description">Meta Description</Label>
            <Textarea
              id="meta-description"
              maxLength={160}
              onChange={(e) => updateMetadata({ description: e.target.value })}
              placeholder="Enter meta description (max 160 characters)"
              rows={3}
              value={metadata.description || ""}
            />
            <p className="text-muted-foreground text-xs">
              {metadata.description?.length || 0}/160 characters
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="meta-keywords">Keywords</Label>
              <Input
                id="meta-keywords"
                onChange={(e) => updateMetadata({ keywords: e.target.value })}
                placeholder="Enter keywords separated by commas"
                value={metadata.keywords || ""}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="meta-author">Author</Label>
              <Input
                id="meta-author"
                onChange={(e) => updateMetadata({ author: e.target.value })}
                placeholder="Enter author name"
                value={metadata.author || ""}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="canonical-url">Canonical URL</Label>
            <Input
              id="canonical-url"
              onChange={(e) => updateMetadata({ canonicalUrl: e.target.value })}
              placeholder="https://example.com/form"
              value={metadata.canonicalUrl || ""}
            />
            <p className="text-muted-foreground text-xs">
              The preferred URL for this form page
            </p>
          </div>
        </div>

        {/* Search Engine Indexing */}
        <div className="flex flex-col gap-4 border-muted border-l-2 pl-6">
          <div className="flex flex-col gap-2">
            <Label>Search Engine Indexing</Label>
            <Select onValueChange={handleRobotsChange} value={getRobotsValue()}>
              <SelectTrigger>
                <SelectValue placeholder="Select indexing behavior" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="index">
                  Index and Follow (Default)
                </SelectItem>
                <SelectItem value="noindex">No Index</SelectItem>
                <SelectItem value="nofollow">No Follow</SelectItem>
                <SelectItem value="noindex,nofollow">
                  No Index, No Follow
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-muted-foreground text-xs">
              Controls whether search engines can index and follow links on this
              page
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={metadata.noArchive}
                id="no-archive"
                onCheckedChange={(checked) =>
                  updateMetadata({ noArchive: checked })
                }
                size="sm"
              />
              <Label className="text-sm" htmlFor="no-archive">
                No Archive
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={metadata.noSnippet}
                id="no-snippet"
                onCheckedChange={(checked) =>
                  updateMetadata({ noSnippet: checked })
                }
                size="sm"
              />
              <Label className="text-sm" htmlFor="no-snippet">
                No Snippet
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={metadata.noImageIndex}
                id="no-image-index"
                onCheckedChange={(checked) =>
                  updateMetadata({ noImageIndex: checked })
                }
                size="sm"
              />
              <Label className="text-sm" htmlFor="no-image-index">
                No Image Index
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={metadata.noTranslate}
                id="no-translate"
                onCheckedChange={(checked) =>
                  updateMetadata({ noTranslate: checked })
                }
                size="sm"
              />
              <Label className="text-sm" htmlFor="no-translate">
                No Translate
              </Label>
            </div>
          </div>
        </div>

        {/* Social Media Settings */}
        <div className="flex flex-col gap-4 border-muted border-l-2 pl-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="og-title">Open Graph Title</Label>
            <Input
              id="og-title"
              onChange={(e) => updateMetadata({ ogTitle: e.target.value })}
              placeholder="Enter Open Graph title"
              value={metadata.ogTitle || ""}
            />
            <p className="text-muted-foreground text-xs">
              Title shown when shared on Facebook, LinkedIn, etc.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="og-description">Open Graph Description</Label>
            <Textarea
              id="og-description"
              onChange={(e) =>
                updateMetadata({ ogDescription: e.target.value })
              }
              placeholder="Enter Open Graph description"
              rows={3}
              value={metadata.ogDescription || ""}
            />
            <p className="text-muted-foreground text-xs">
              Description shown when shared on social media
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="og-image">Open Graph Image URL</Label>
              <Input
                id="og-image"
                onChange={(e) => updateMetadata({ ogImage: e.target.value })}
                placeholder="https://example.com/image.jpg"
                value={metadata.ogImage || ""}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="og-type">Open Graph Type</Label>
              <Select
                onValueChange={(value) => updateMetadata({ ogType: value })}
                value={metadata.ogType || "website"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Open Graph type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="profile">Profile</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="twitter-card">Twitter Card Type</Label>
            <Select
              onValueChange={(value) =>
                updateMetadata({ twitterCard: value as any })
              }
              value={metadata.twitterCard || "summary"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Twitter card type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summary">Summary</SelectItem>
                <SelectItem value="summary_large_image">
                  Summary Large Image
                </SelectItem>
                <SelectItem value="app">App</SelectItem>
                <SelectItem value="player">Player</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="twitter-title">Twitter Title</Label>
              <Input
                id="twitter-title"
                onChange={(e) =>
                  updateMetadata({ twitterTitle: e.target.value })
                }
                placeholder="Enter Twitter title"
                value={metadata.twitterTitle || ""}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="twitter-image">Twitter Image URL</Label>
              <Input
                id="twitter-image"
                onChange={(e) =>
                  updateMetadata({ twitterImage: e.target.value })
                }
                placeholder="https://example.com/twitter-image.jpg"
                value={metadata.twitterImage || ""}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="twitter-description">Twitter Description</Label>
            <Textarea
              id="twitter-description"
              onChange={(e) =>
                updateMetadata({ twitterDescription: e.target.value })
              }
              placeholder="Enter Twitter description"
              rows={3}
              value={metadata.twitterDescription || ""}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="twitter-site">Twitter Site</Label>
              <Input
                id="twitter-site"
                onChange={(e) =>
                  updateMetadata({ twitterSite: e.target.value })
                }
                placeholder="@yourhandle"
                value={metadata.twitterSite || ""}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="twitter-creator">Twitter Creator</Label>
              <Input
                id="twitter-creator"
                onChange={(e) =>
                  updateMetadata({ twitterCreator: e.target.value })
                }
                placeholder="@creatorhandle"
                value={metadata.twitterCreator || ""}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
