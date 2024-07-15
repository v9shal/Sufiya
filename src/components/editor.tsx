"use client"

import React, { useState, useRef } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import {upsertStory} from '@/action/action'

interface TextEditorProps {
  initialTitle?: string
  initialContent?: string
  storyId?: string
}

const TextEditor: React.FC<TextEditorProps> = ({ initialTitle = '', initialContent = '', storyId }) => {
  const [title, setTitle] = useState(initialTitle)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const editorRef = useRef<any>(null)

  const handleEditorInit = (_evt: any, editor: any) => {
    editorRef.current = editor
  }

  const saveContent = async () => {
    if (title && editorRef.current) {
      setIsSaving(true)
      const content = editorRef.current.getContent()
      const formData = new FormData()
      formData.append('title', title)
      formData.append('content', content)
      if (storyId) formData.append('id', storyId)

      try {
        const result = await upsertStory(formData)
        if (result.success) {
          setLastSaved(new Date())
        } else {
          console.error('Failed to save:', result.error)
        }
      } catch (error) {
        console.error('Error saving:', error)
      } finally {
        setIsSaving(false)
      }
    }
  }

  return (
    <div className="m-0 story-editor bg-red-200 rounded-lg shadow-md p-4 max-w-2xl mx-auto my-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter your story title"
        className="story-title w-full p-2 mb-1 text-lg border border-gray-800 rounded-xl"
      />
      <Editor
        apiKey='62g25nfxenn8o8rj6dowlpnmnrn922qydnw6pgmpguffuzp9'
        onInit={handleEditorInit}
        initialValue={initialContent}
        init={{
          height: 350,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'print', 'preview', 'anchor',
            'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'paste', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | formatselect | ' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
      />
      <div className="editor-footer flex justify-between items-center mt-4">
        {isSaving ? (
          <span className="text-gray-500">Saving...</span>
        ) : lastSaved ? (
          <span className="text-gray-500">Last saved: {lastSaved.toLocaleTimeString()}</span>
        ) : null}
        <button 
          onClick={saveContent} 
          disabled={isSaving} 
          className="save-button bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
        >
          Save Now
        </button>
      </div>
    </div>
  )
}

export default TextEditor