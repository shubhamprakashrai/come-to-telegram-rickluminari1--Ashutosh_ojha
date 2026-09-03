'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bold, Italic, Underline, Strikethrough, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Link as LinkIcon, Image as ImageIcon,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Undo, Redo,
  Highlighter, Sparkles, UploadCloud, Loader2, Minus, Code, Trash2
} from 'lucide-react';
import { uploadImageToR2 } from '@/lib/r2Upload';

interface RichDocEditorProps {
  initialHtml?: string;
  onChange: (html: string) => void;
  coverImage?: string;
  onCoverChange: (url: string) => void;
}

export default function RichDocEditor({
  initialHtml = '',
  onChange,
  coverImage,
  onCoverChange,
}: RichDocEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCoverUploading, setIsCoverUploading] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Set initial content
  useEffect(() => {
    if (editorRef.current && initialHtml && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = initialHtml;
      updateStats();
    }
  }, [initialHtml]);

  const updateStats = useCallback(() => {
    if (editorRef.current) {
      const text = editorRef.current.innerText || '';
      const words = text.trim().split(/\s+/).filter(Boolean).length;
      setWordCount(words);
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  // Execute standard document commands
  const execCmd = (command: string, value: string | undefined = undefined) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, value);
    updateStats();
  };

  const handleFormatBlock = (tag: string) => {
    execCmd('formatBlock', `<${tag}>`);
  };

  const handleInsertLink = () => {
    const url = prompt('Enter web link URL (https://...):');
    if (url) {
      execCmd('createLink', url);
    }
  };

  // Upload image to Cloudflare R2 and insert into document
  const handleUploadAndInsertImage = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    setIsUploading(true);
    try {
      const publicUrl = await uploadImageToR2(file);
      
      // Focus editor and insert image HTML at cursor
      if (editorRef.current) {
        editorRef.current.focus();
      }
      
      const imgHtml = `
        <figure class="my-6 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-950 inline-block w-full">
          <img src="${publicUrl}" alt="Legal Article Graphic" class="w-full max-h-[480px] object-cover rounded-xl" />
          <figcaption class="p-2 text-center text-xs text-gray-400 italic bg-slate-900/60 border-t border-white/5">Uploaded Legal Media</figcaption>
        </figure>
        <p><br></p>
      `;
      document.execCommand('insertHTML', false, imgHtml);
      updateStats();
    } catch (e) {
      console.error('Failed to upload image to R2', e);
      alert('Failed to upload image to Cloudflare R2. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCoverUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setIsCoverUploading(true);
    try {
      const url = await uploadImageToR2(file);
      onCoverChange(url);
    } catch (e) {
      console.error('Failed to upload cover', e);
      alert('Failed to upload cover photo');
    } finally {
      setIsCoverUploading(false);
    }
  };

  // Handle Drag & Drop of image files onto editor
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        await handleUploadAndInsertImage(file);
      }
    }
  };

  // Handle Clipboard Paste of image files directly (Cmd+V / Ctrl+V)
  const handlePaste = async (e: React.ClipboardEvent) => {
    if (e.clipboardData.files && e.clipboardData.files.length > 0) {
      const file = e.clipboardData.files[0];
      if (file.type.startsWith('image/')) {
        e.preventDefault();
        await handleUploadAndInsertImage(file);
      }
    }
  };

  return (
    <div className="flex flex-col bg-slate-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleUploadAndInsertImage(e.target.files[0]);
          }
        }}
      />
      <input
        ref={coverInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleCoverUpload(e.target.files[0]);
          }
        }}
      />

      {/* Cover Photo Upload Banner */}
      <div className="relative border-b border-white/10 bg-slate-900/60">
        {coverImage ? (
          <div className="relative w-full h-48 sm:h-60 group overflow-hidden">
            <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3 backdrop-blur-xs">
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="px-4 py-2 bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl border border-white/20 shadow-lg flex items-center"
              >
                <UploadCloud className="w-4 h-4 mr-1.5 text-amber-400" />
                Change Cover Photo
              </button>
              <button
                type="button"
                onClick={() => onCoverChange('')}
                className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl border border-red-500/30"
                title="Remove cover"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => coverInputRef.current?.click()}
            className="w-full h-32 border-2 border-dashed border-white/10 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all flex flex-col items-center justify-center cursor-pointer p-4 group"
          >
            {isCoverUploading ? (
              <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Uploading Cover to Cloudflare R2...</span>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-2xl bg-white/5 group-hover:bg-amber-500/10 flex items-center justify-center mb-2 transition-colors">
                  <ImageIcon className="w-5 h-5 text-gray-400 group-hover:text-amber-400 transition-colors" />
                </div>
                <span className="text-xs font-semibold text-gray-300 group-hover:text-white">
                  Add Article Cover Banner (Optional)
                </span>
                <span className="text-[11px] text-gray-500 mt-0.5">
                  Click to upload high-res image directly to Cloudflare R2
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Google Docs Style Toolbar */}
      <div className="sticky top-0 z-30 p-2.5 bg-slate-900/95 backdrop-blur-md border-b border-white/10 flex flex-wrap items-center gap-1 text-gray-300">
        {/* Undo / Redo */}
        <button
          type="button"
          onClick={() => execCmd('undo')}
          className="p-2 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCmd('redo')}
          className="p-2 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
          title="Redo (Ctrl+Y)"
        >
          <Redo className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-white/10 my-auto mx-1" />

        {/* Headings */}
        <select
          onChange={(e) => handleFormatBlock(e.target.value)}
          defaultValue="p"
          className="bg-slate-950 border border-white/10 text-gray-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500"
        >
          <option value="p">Normal Text</option>
          <option value="h1">Title (H1)</option>
          <option value="h2">Section (H2)</option>
          <option value="h3">Subsection (H3)</option>
          <option value="blockquote">Quote Callout</option>
          <option value="pre">Code Block</option>
        </select>

        <div className="w-px h-5 bg-white/10 my-auto mx-1" />

        {/* Basic Styles */}
        <button
          type="button"
          onClick={() => execCmd('bold')}
          className="p-2 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCmd('italic')}
          className="p-2 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCmd('underline')}
          className="p-2 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCmd('strikeThrough')}
          className="p-2 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-white/10 my-auto mx-1" />

        {/* Highlights / Gold Color */}
        <button
          type="button"
          onClick={() => execCmd('foreColor', '#f59e0b')}
          className="p-2 hover:bg-amber-500/20 text-amber-400 rounded-lg transition-colors"
          title="Gold Legal Highlight"
        >
          <Highlighter className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCmd('foreColor', '#ffffff')}
          className="p-2 hover:bg-white/10 text-white rounded-lg transition-colors"
          title="White text"
        >
          <span className="font-bold text-xs">A</span>
        </button>

        <div className="w-px h-5 bg-white/10 my-auto mx-1" />

        {/* Alignment */}
        <button
          type="button"
          onClick={() => execCmd('justifyLeft')}
          className="p-2 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCmd('justifyCenter')}
          className="p-2 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCmd('justifyRight')}
          className="p-2 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-white/10 my-auto mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => execCmd('insertUnorderedList')}
          className="p-2 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
          title="Bulleted List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCmd('insertOrderedList')}
          className="p-2 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-white/10 my-auto mx-1" />

        {/* Links & Divider */}
        <button
          type="button"
          onClick={handleInsertLink}
          className="p-2 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
          title="Insert Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCmd('insertHorizontalRule')}
          className="p-2 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
          title="Insert Divider"
        >
          <Minus className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-white/10 my-auto mx-1" />

        {/* Direct Image Upload to Cloudflare R2 Button */}
        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-amber-600/20 disabled:opacity-50 ml-auto"
          title="Upload image from computer directly to Cloudflare R2"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
              <span>Uploading to R2...</span>
            </>
          ) : (
            <>
              <UploadCloud className="w-4 h-4 mr-1.5" />
              <span>Insert Image</span>
            </>
          )}
        </button>
      </div>

      {/* Visual WYSIWYG Document Canvas */}
      <div className="relative min-h-[420px] max-h-[600px] overflow-y-auto p-8 sm:p-12 bg-slate-950/80 cursor-text">
        <div
          ref={editorRef}
          contentEditable
          onInput={updateStats}
          onBlur={updateStats}
          onDrop={handleDrop}
          onPaste={handlePaste}
          className="outline-none text-gray-200 text-base leading-relaxed space-y-4 font-normal focus:ring-0 [&_h1]:text-3xl [&_h1]:font-extrabold [&_h1]:text-white [&_h1]:my-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:my-3 [&_h2]:border-b [&_h2]:border-white/10 [&_h2]:pb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-amber-400 [&_h3]:my-2 [&_blockquote]:border-l-4 [&_blockquote]:border-amber-500 [&_blockquote]:pl-4 [&_blockquote]:py-2 [&_blockquote]:italic [&_blockquote]:bg-amber-500/5 [&_blockquote]:rounded-r-xl [&_blockquote]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-amber-400 [&_a]:underline [&_figure]:my-6 [&_pre]:bg-slate-900 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-white/10 [&_hr]:border-white/10 [&_hr]:my-6 min-h-[300px]"
          data-placeholder="Start typing your legal article, analysis, or advisory commentary here... You can drag & drop or paste images directly into this canvas."
        />
      </div>

      {/* Editor Footer Stats */}
      <div className="p-3 bg-slate-900/80 border-t border-white/10 flex items-center justify-between text-xs text-gray-400 font-mono px-6">
        <div className="flex items-center space-x-4">
          <span>{wordCount} words</span>
          <span>•</span>
          <span>~{Math.max(1, Math.ceil(wordCount / 200))} min read</span>
          <span>•</span>
          <span className="text-emerald-400 flex items-center">
            <Sparkles className="w-3 h-3 mr-1" /> Cloudflare R2 Auto-Upload Enabled
          </span>
        </div>
        <span className="text-gray-500 text-[11px] hidden sm:inline">
          Tip: Paste or drag images directly onto the canvas
        </span>
      </div>
    </div>
  );
}
