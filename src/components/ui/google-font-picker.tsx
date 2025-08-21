'use client';

import { Check, ChevronDown, Search, Type } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { loadGoogleFont } from '@/lib/utils/google-fonts';
import { Loader } from './loader';
import { Input } from './input';

// Google Fonts API types
interface GoogleFont {
  family: string;
  variants: string[];
  subsets: string[];
  version: string;
  lastModified: string;
  files: Record<string, string>;
  category: 'serif' | 'sans-serif' | 'monospace' | 'display' | 'handwriting';
  kind: string;
  menu: string;
  axes?: Array<{
    tag: string;
    start: number;
    end: number;
  }>;
}

interface GoogleFontsResponse {
  kind: string;
  items: GoogleFont[];
}

// Category mapping
const CATEGORY_MAP = {
  'sans-serif': 'Sans Serif',
  'serif': 'Serif',
  'monospace': 'Monospace',
  'display': 'Display',
  'handwriting': 'Handwriting',
} as const;

const FONT_CATEGORIES = [
  { id: 'all', label: 'All Fonts' },
  { id: 'Sans Serif', label: 'Sans Serif' },
  { id: 'Serif', label: 'Serif' },
  { id: 'Display', label: 'Display' },
  { id: 'Monospace', label: 'Monospace' },
  { id: 'Handwriting', label: 'Handwriting' },
] as const;

interface GoogleFontPickerProps {
  value?: string;
  onChange: (fontFamily: string) => void;
  label?: string;
  placeholder?: string;
  showPreview?: boolean;
}

export function GoogleFontPicker({
  value,
  onChange,
  label = 'Font Family',
  placeholder = 'Select a font...',
  showPreview = true,
}: GoogleFontPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'Sans Serif' | 'Serif' | 'Display' | 'Monospace' | 'Handwriting'>('all');
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set());
  const [fonts, setFonts] = useState<GoogleFont[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch fonts from Google Fonts API
  useEffect(() => {
    const fetchFonts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/google-fonts');
        
        if (!response.ok) {
          throw new Error('Failed to fetch fonts');
        }
        
        const data: GoogleFontsResponse = await response.json();
        setFonts(data.items || []);
      } catch (err) {
        console.error('Error fetching fonts:', err);
        setError('Failed to load fonts. Please try again.');
        // Fallback to a curated list of popular fonts
        setFonts(getFallbackFonts());
      } finally {
        setLoading(false);
      }
    };

    fetchFonts();
  }, []);

  // Fallback fonts if API fails
  const getFallbackFonts = (): GoogleFont[] => [
    { family: 'Inter', category: 'sans-serif', variants: ['400', '500', '600', '700'], subsets: ['latin'], version: 'v12', lastModified: '2022-09-22', files: {}, kind: 'webfonts#webfont', menu: '' },
    { family: 'Roboto', category: 'sans-serif', variants: ['300', '400', '500', '700'], subsets: ['latin'], version: 'v30', lastModified: '2022-09-22', files: {}, kind: 'webfonts#webfont', menu: '' },
    { family: 'Open Sans', category: 'sans-serif', variants: ['400', '600', '700'], subsets: ['latin'], version: 'v34', lastModified: '2022-09-22', files: {}, kind: 'webfonts#webfont', menu: '' },
    { family: 'Lato', category: 'sans-serif', variants: ['400', '700'], subsets: ['latin'], version: 'v23', lastModified: '2022-09-22', files: {}, kind: 'webfonts#webfont', menu: '' },
    { family: 'Montserrat', category: 'sans-serif', variants: ['400', '500', '600', '700'], subsets: ['latin'], version: 'v25', lastModified: '2022-09-22', files: {}, kind: 'webfonts#webfont', menu: '' },
    { family: 'Poppins', category: 'sans-serif', variants: ['400', '500', '600', '700'], subsets: ['latin'], version: 'v20', lastModified: '2022-09-22', files: {}, kind: 'webfonts#webfont', menu: '' },
    { family: 'Playfair Display', category: 'serif', variants: ['400', '500', '600', '700'], subsets: ['latin'], version: 'v30', lastModified: '2022-09-22', files: {}, kind: 'webfonts#webfont', menu: '' },
    { family: 'Merriweather', category: 'serif', variants: ['400', '700'], subsets: ['latin'], version: 'v30', lastModified: '2022-09-22', files: {}, kind: 'webfonts#webfont', menu: '' },
    { family: 'Fira Code', category: 'monospace', variants: ['400', '500', '700'], subsets: ['latin'], version: 'v14', lastModified: '2022-09-22', files: {}, kind: 'webfonts#webfont', menu: '' },
    { family: 'JetBrains Mono', category: 'monospace', variants: ['400', '500', '700'], subsets: ['latin'], version: 'v13', lastModified: '2022-09-22', files: {}, kind: 'webfonts#webfont', menu: '' },
  ];

  // Filter fonts based on search and category
  const filteredFonts = React.useMemo(() => {
    let filtered = fonts;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      const categoryKey = Object.entries(CATEGORY_MAP).find(([_, value]) => value === selectedCategory)?.[0];
      if (categoryKey) {
        filtered = filtered.filter(font => font.category === categoryKey);
      }
    }
    
    // Filter by search
    if (search) {
      const lowercaseSearch = search.toLowerCase();
      filtered = filtered.filter(font => 
        font.family.toLowerCase().includes(lowercaseSearch)
      );
    }
    
    // Sort by popularity (families with more variants are generally more popular)
    filtered.sort((a, b) => b.variants.length - a.variants.length);
    
    return filtered.slice(0, 100); // Limit to 100 fonts for performance
  }, [fonts, search, selectedCategory]);

  // Load font preview when hovering
  const preloadFont = async (fontFamily: string) => {
    if (!loadedFonts.has(fontFamily)) {
      try {
        await loadGoogleFont(fontFamily);
        setLoadedFonts((prev) => new Set([...prev, fontFamily]));
      } catch (error) {
        console.warn('Failed to load font:', fontFamily, error);
      }
    }
  };

  // Load the selected font
  useEffect(() => {
    if (value && !loadedFonts.has(value)) {
      preloadFont(value);
    }
  }, [value, loadedFonts]);

  const selectedFont = fonts.find((font) => font.family === value);

  const handleFontSelect = (fontFamily: string) => {
    console.log('Font selected:', fontFamily);
    onChange(fontFamily);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}

      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            aria-expanded={open}
            className="w-full justify-between font-normal"
            role="combobox"
            variant="outline"
          >
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4 text-muted-foreground" />
              {value ? (
                <div className="flex items-center gap-2">
                  <span
                    style={{
                      fontFamily: loadedFonts.has(value)
                        ? `"${value}", system-ui, sans-serif`
                        : undefined,
                    }}
                  >
                    {value}
                  </span>
                  {selectedFont && (
                    <Badge className="text-xs" variant="secondary">
                      {CATEGORY_MAP[selectedFont.category]}
                    </Badge>
                  )}
                </div>
              ) : (
                placeholder
              )}
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-[450px] p-4">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="flex items-center">
              <Input
                leftIcon={<Search className="h-4 w-4 shrink-0 opacity-50" />}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search fonts..."
                value={search}
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {FONT_CATEGORIES.map((category) => (
                <Button
                  className="h-6 px-2 text-xs"
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  size="sm"
                  variant={selectedCategory === category.id ? 'default' : 'ghost'}
                >
                  {category.label}
                </Button>
              ))}
            </div>

            {/* Font List */}
            {loading && (
              <div className="py-8 text-center">
                <Loader/>
                <p className="text-muted-foreground text-sm mt-2">Loading fonts...</p>
              </div>
            )}
            
            {error && (
              <div className="py-8 text-center">
                <Type className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground">{error}</p>
                <p className="text-muted-foreground text-xs">Using fallback fonts.</p>
              </div>
            )}
            
            {!loading && !error && (
              <ScrollArea className="h-[350px]">
                {filteredFonts.length === 0 ? (
                  <div className="py-8 text-center">
                    <Type className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">No fonts found.</p>
                    <p className="text-muted-foreground text-xs">Try a different search term or category.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {filteredFonts.map((font) => (
                      <div
                        key={font.family}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all duration-200",
                          "hover:bg-accent/50",
                          value === font.family && "bg-accent/30 border border-primary/20"
                        )}
                        onClick={() => handleFontSelect(font.family)}
                        onMouseEnter={() => preloadFont(font.family)}
                      >
                        <div className="flex flex-1 flex-col gap-2">
                          <div className="flex items-center gap-3">
                            <span
                              className="font-medium text-base"
                              style={{
                                fontFamily: loadedFonts.has(font.family)
                                  ? `"${font.family}", system-ui, sans-serif`
                                  : undefined,
                              }}
                            >
                              {font.family}
                            </span>
                            <Badge className="text-xs" variant="outline">
                              {CATEGORY_MAP[font.category]}
                            </Badge>
                            <Badge className="text-xs" variant="secondary">
                              {font.variants.length} styles
                            </Badge>
                          </div>
                          {showPreview && (
                            <div className="flex flex-col gap-1">
                              <p
                                className="text-muted-foreground text-sm"
                                style={{
                                  fontFamily: loadedFonts.has(font.family)
                                    ? `"${font.family}", system-ui, sans-serif`
                                    : undefined,
                                }}
                              >
                                The quick brown fox jumps over the lazy dog
                              </p>
                              <p className="text-muted-foreground text-xs">
                                {font.variants.join(', ')} • {font.subsets.join(', ')}
                              </p>
                            </div>
                          )}
                        </div>
                        <Check
                          className={cn(
                            'h-4 w-4 shrink-0 transition-opacity',
                            value === font.family ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
