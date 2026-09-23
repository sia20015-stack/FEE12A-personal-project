import { EditorContent, useEditor } from '@tiptap/react'
import { Node } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import imageCompression from 'browser-image-compression'


const ImageBlock = Node.create({
  name: 'imageBlock',
  group: 'block',
  draggable: true,

  addAttributes() {
    return { src: {} }
  },

  parseHTML() {
    return [{ tag: 'img' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'img',
      {
        ...HTMLAttributes,
        style: 'max-width:100%; display:block; margin:16px 0; border-radius:12px',
      },
    ]
  },
})


const OpenWrite = () => {

    const [title, setTitle] = useState('')
    // const [content, setContent] = useState('')
    // 색상 3개 저장하는 상자 만들기
    const [colors, setColors] = useState(['#000000', '#000000', '#000000'])
    const labels = ['아침', '점심', '저녁']
    
    const [thumbnail, setThumbnail] = useState(null)

    const navigate = useNavigate()

    const username = localStorage.getItem("username")

    const handleSubmit = async (e) => {
        e.preventDefault()

        const html = editor.getHTML()
        const textOnly = editor.getText()

        if (!title.trim()) {
            alert('제목을 입력해주세요')
            return
        }

        if (!textOnly) {
            alert('내용을 입력해주세요')
            return
        }

        const payload = {
            title,
            content: html,
            colors,
            thumbnail,
            username,
            visibility: "open"
        }

        try {
            await axios.post(
                `${process.env.REACT_APP_API_URL}/api/posts`,
                payload
            )

            alert('일기 작성 완료')

            setTitle('')
            setColors(['#000000', '#000000', '#000000'])

            editor.commands.clearContent()

            navigate('/open')

        } catch(err){
            console.log(err)
            alert('일기 작성 실패')
        }
    }
    
    // 이거 onChange 여러번 쓰기 싫어서 만든 함수
    const handleChange = (e) => {
        const {name, value} = e.target

        if (name === 'title') setTitle(value)
        // if (name === 'content') setContent(value) 
    }

    const editor = useEditor({
        extensions: [
            StarterKit,
            ImageBlock,
            Placeholder.configure({
            placeholder: '내용을 입력하세요',
            }),
        ],
        content: '',
    })


    // ai가 색 추천해주는
    const [loadingPalette, setLoadingPalette] = useState(false)

    const recommendPalette = async () => {

        if (!editor) return

        try {

            setLoadingPalette(true)

            const text = editor.getText()

            const res = await axios.post(
                `${process.env.REACT_APP_AI_URL}/palette`,
                {
                    content: text
                }
            )

            setColors(res.data.colors)

        } catch(err) {
            console.log(err)
            alert('AI 팔레트 추천 실패')
        } finally {
            setLoadingPalette(false)
        }
    }




  return (
    <>
        <div className="write_wrap">
            <h2 className="write_type">공개 일기 작성</h2>
            <div className='h2line_write'></div>

            <div className="editor_layout">

                <div className="left_panel">
                <div className="thumbnail_area">
                    <p>커버 이미지</p>
                    <div className={`thumb_wrapper ${thumbnail ? 'filled' : ''}`}>
                            {thumbnail ? (
                                <img
                                    src={`${process.env.REACT_APP_API_URL}${thumbnail}`}
                                    className="thumb_preview"
                                    alt="커버 이미지 미리보기"
                                />
                            ) : (
                                <span className="thumb_placeholder">
                                    이미지 미리보기
                                </span>
                            )}
                        </div>

                    <label className="thumb_upload_btn">
                        커버 이미지 선택
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={async (e) => {
                                const file = e.target.files[0]
                                if (!file) return

                                const compressed = await imageCompression(file, {
                                    maxSizeMB: 1,
                                    maxWidthOrHeight: 1000,
                                    useWebWorker: true,
                                })

                                const formData = new FormData()
                                formData.append("file", compressed)

                                const res = await axios.post(
                                    `${process.env.REACT_APP_API_URL}/api/files/upload`,
                                    formData
                                )

                                setThumbnail(res.data.url)
                            }}
                        />
                    </label>
                </div>

                <div className="color_area">
                    <p>오늘의 감정 팔레트</p>
                    {colors.map((color, idx) => (
                            <div className='colorpick' key={idx}>
                                <span>{labels[idx]}</span>
                                <input type='color' value={color} 
                                    onChange={(e) => {const newColors=[...colors] 
                                    newColors[idx] = e.target.value 
                                    setColors(newColors)}}/>
                                <span>{color}</span>
                            </div>))}

                    <button className='ai_palette_btn' onClick={recommendPalette} disabled={loadingPalette}>
                        {loadingPalette ? 'AI 분석중...' : 'AI 감정 팔레트 추천'}
                    </button>
                </div>

        
                </div>

                <div className="right_panel">
                    <input
                    className="title"
                    name="title"
                    value={title}
                    onChange={handleChange}
                    placeholder="제목"
                     />
                    <EditorContent className="content" editor={editor} />
                </div>
            </div>
            <div className='btn_write'>
                    <label className="image_upload_btn">
                        이미지 추가
                        <input
                            type='file'
                            accept='image/*'
                            hidden

                            onChange={async (e) => {

                                const file = e.target.files[0]

                                if (!file) return

                                try {

                                    // 이미지 압축
                                    const compressedFile = await imageCompression(file, {
                                        maxSizeMB: 1,
                                        maxWidthOrHeight: 1920,
                                        useWebWorker: true,
                                    })

                                    // 서버 업로드
                                    const formData = new FormData()
                                    formData.append("file", compressedFile)

                                    const res = await axios.post(
                                        `${process.env.REACT_APP_API_URL}/api/files/upload`,
                                        formData
                                    )

                                    // 서버 이미지 URL
                                    const imageUrl =
                                        `${process.env.REACT_APP_API_URL}${res.data.url}`

                                    editor
                                        .chain()
                                        .focus()
                                        .insertContent({
                                            type: 'imageBlock',
                                            attrs: {
                                                src: imageUrl,
                                            },
                                        })
                                        .run()

                                } catch (err) {
                                    console.log(err)
                                }
                            }}
                        />
                    </label>
                    <button className='posting_btn' onClick={handleSubmit}>작성하기</button>
                </div>
        </div>
    </>
  )
}

export default OpenWrite