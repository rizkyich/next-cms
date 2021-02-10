import {useState, useEffect, useRef} from 'react'
import MainLayout from '../components/MainLayout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Editor } from '@tinymce/tinymce-react'

export default function WriteArticle() {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('higoesupdate')
  const [keywords, setKeywords] = useState('')
  const [metaTag, setMetaTag] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [showUpload, setShowUpload] = useState(null)
  const [content, setContent] = useState('')
  const [objContent, setObjContent] = useState([{id: 0,  selectedFile: '', preview: '', srcImg: '', descImg: ''}])
  const [tags, setTags] = useState([])
  const [inputNotComplete, setInputNotComplete] = useState(false)
  const [loading, setLoading] = useState(false)
  const textInput = useRef()

  const mutateContent = (key, value, indexId) => {
    setObjContent([...objContent].map(item => {
      if (item.id === indexId) {
        return {
          ...item,
          [key]: value
        }
      } else {
        return item
      }
    }))
  }

  const onSelectFile = e => {
      if (!e.target.files || e.target.files.length === 0) {
          // setSelectedFile(undefined)
          return
      }
      mutateContent('selectedFile', e.target.files, showUpload)
  }

  const handleUploadImg = (e) => {
    e.preventDefault()

    if (!objContent[showUpload].srcImg || !objContent[showUpload].descImg || !objContent[showUpload].selectedFile) {
      // setPreview(undefined)
      confirm('YANG LENGKAP ZAR')
      return
    }

    // const reader = new FileReader()
    // reader.

    const objectUrl = URL.createObjectURL(objContent[showUpload].selectedFile[0])
    mutateContent('preview', objectUrl, objContent[showUpload].id)
    setShowUpload(null)
  }

  const handleEditorChange = (content, editor) => {
    if (editor.id === 'edit-base') {
      setContent(content)
    } else {
      const idx =  editor.id.split('-')
      mutateContent('content', content, objContent[idx[1]].id)
    }
  }

  const addSection = (str) => {
    if (str === 'section') {
      setObjContent([...objContent, {
        id: objContent.length,
        subTitle: '',
        selectedFile: '', 
        preview: '', 
        srcImg: '', 
        descImg: '',
        content: '',
        type: str
      }])
    }

    if (str === 'image') {
      setObjContent([...objContent, {
        id: objContent.length,
        selectedFile: '', 
        preview: '', 
        srcImg: '', 
        descImg: '',
        type: str
      }])
    }

    if (str === 'paragraph') {
      setObjContent([...objContent, {
        id: objContent.length,
        content: '',
        type: str
      }])
    }

    if (str === 'subtitle') {
      setObjContent([...objContent, {
        id: objContent.length,
        subTitle: '',
        type: str
      }])
    }
  }

  const removeObj = (idx, objId) => {
    const index = objContent.findIndex(obj => obj.id === objId)
    setObjContent([
      ...objContent.slice(0, index),
      ...objContent.slice(index + 1)
    ])

    console.log(objContent)
  }

  const processedArticle = () => {
    const toPost = {
      type: category,
      keyword: keywords,
      metadescription: metaTag,
      blog_image_id: '1074',
      title,
      subtitle: excerpt,
      content,
      subcontent: []
    }

    objContent.forEach(item => {
      if (item.type === 'section') {
        const arr = [
          {
            type: 'subtitle',
            value: item.subTitle
          },{
            type: 'image',
            value: "1074"
          },
          {
            type: 'content',
            value: item.content
          }
        ]

        toPost.subcontent = [...toPost.subcontent, ...arr]
      } else if (item.type === 'subtitle') {
        toPost.subcontent.push({
          type: 'subtitle',
          value: item.subTitle
        })
      } else if (item.type === 'image') {
        toPost.subcontent.push({
          type: 'image',
          value: '1074'
        })
      } else if (item.type === 'paragraph') {
        toPost.subcontent.push({
          type: 'content',
          value: item.content
        })
      }
    })

    let notComplete = false

    for (const key in toPost) {
      if (key === 'subcontent') {
        toPost[key].forEach(e =>  { if (!e) notComplete = true })
      } else if (!toPost[key]) {
        notComplete = true
      } 
    }

    if (notComplete) {
      return null
    } else {
      toPost.subcontent = JSON.stringify(toPost.subcontent)
      return toPost
    }

  }

  const postArticle = async (e) => {
    console.log(e, 'event')
    e.preventDefault()

    const articleObj = processedArticle()

    if (!articleObj) {
      return null
    } else {
      setLoading(true)
  
      const res = await fetch('https://apiw.higo.id/adminblog-savearticle', 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(articleObj, null, 2)
        }
      )
  
      const json = res.json()
      return json
    }
  }

  const removeTag = (idx) => {
    // e.preventDefault()
    console.log('halo')
    const newTag = [...tags]
    newTag.splice(idx, 1)
    setTags(newTag)
  }

  useEffect(() => {
    console.log(tags, 'set')
  }, [tags]);

  const inputKeyDown = (e) => {
    const val = e.target.value
    if (e.key === 'Enter' && val) {
      if (tags.find(tag => tag.toLowerCase() === val.toLowerCase())) {
        return
      }
      // console.log(val)
      // const newTag = [...tags]
      // newTag.push(val)
      console.log([...tags, val], 'kenapa')
      setTags([...tags, val])
      textInput.current.value = null
    } else if (e.key === 'Backspace' && !val) {
      console.log('trig')
      removeTag(tags.length - 1)
    }
  }

  const catchResponse = (res) => {
    if (!res) {
      setInputNotComplete(true)
      setLoading(false)
    } else {
      setLoading(false)
    }
  }

  return (
    <>
      <MainLayout showOverflow={showUpload} back={true}>
        {
          loading &&
          <div className="fixed left-0 top-0 z-50 w-full text-white flex justify-center items-center h-full bg-black opacity-50">
            <p>{'LOADING ZAR <3'}</p>
          </div>
        }
        {
          inputNotComplete &&
          <div className="fixed left-0 top-0 z-50 w-full text-white flex justify-center items-center h-full">
            <div className="px-12 h-16 z-20 relative bg-white rounded-lg text-black flex justify-center items-center">
            <button onClick={() => setInputNotComplete(false)} className="w-10 h-10 rounded-full absolute shadow-xl bg-red-600 -top-2 -right-2 flex items-center justify-center">
                <FontAwesomeIcon size="lg" color="white" icon={["fas", "times"]} />
              </button>
              <p>{'YANG LENGKAP ZAR, YUK BISA YUK!!! <3'}</p>
            </div>

            <div className="absolute w-full h-full bg-black opacity-50"></div>
          </div>
        }
        {
          showUpload !== null &&
          <div className="w-full h-full fixed z-50 top-0">
            <div className="w-full h-full bg-black opacity-20 " onClick={() => setShowUpload(null)}></div>
            <div className="absolute p-4 w-4/12 h-auto shadow-lg transform -translate-x-1/4	-translate-y-2/4	left-1/3 rounded-lg top-1/2 bg-white">
              <button onClick={() => setShowUpload(null)} className="w-10 h-10 rounded-full absolute shadow-xl bg-red-600 -top-2 -right-2 flex items-center justify-center">
                <FontAwesomeIcon size="lg" color="white" icon={["fas", "times"]} />
              </button>
              
              
            <h3>Upload Image</h3>
              <form onSubmit={e => handleUploadImg(e)}>
                <div className="my-3 flex">
                  <input
                    className="mr-3"
                    type="file" 
                    name="user[image]" 
                    multiple={true}
                    onChange={onSelectFile}/>            
                </div>

                <input
                  value={objContent[showUpload].srcImg}
                  onChange={e => mutateContent('srcImg', e.target.value, objContent[showUpload].id)}
                  className="my-3 focus:outline-none focus:ring focus:border-blue-600  w-full px-4 py-2 bg-gray-200 shadow-lg rounded-lg"
                  placeholder="Alamat URL Sumber"
                />

                <input
                  value={objContent[showUpload].descImg}
                  onChange={e => mutateContent('descImg', e.target.value, objContent[showUpload].id)}
                  className="my-3 focus:outline-none focus:ring focus:border-blue-600  w-full px-4 py-2 bg-gray-200 shadow-lg rounded-lg"
                  placeholder="Deskripsi Gambar"
                />

              <div className="w-full mt-2 flex items-center justify-center">
                <button className="focus:outline-none px-4 py-3 bg-gradient-to-l from-green-400 to-blue-500 text-white rounded-lg cursor-pointer">
                  <p>Submit</p>
                </button>
              </div>

              </form>
            </div>
          </div>
        }
        <div className="w-full container mb-12 px-32 max-w-7xl mx-auto mt-12 pb-12">
          {/* SELECT CATEGORY */}
          <div className="mt-2 w-full items-center flex space-x-2">
            <h4 className="w-2/12">Select Category:</h4>
            {/* <Select value={category} onChange={e => setCategory(e)} className="w-full" options={selectOptions}/>  */}
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="focus:outline-none focus:ring focus:border-blue-600 w-10/12 px-4 py-3 bg-gray-200 shadow-lg rounded-lg"
            >
              <option value="higoesupdate">HIGOes Update</option>
              <option value="hangout">Hangout</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="businesstips">Business Tips</option>
            </select>
          </div>

          <div className="mt-6 w-full items-center">
            <div className="w-full flex items-center">
              <h4 className="w-2/12">Select Tag:</h4>
              <div className="focus:outline-none focus:ring focus:border-blue-600 w-10/12 px-4 py-3 bg-gray-200 shadow-lg rounded-lg">
                <ul className="flex">
                  {
                    tags.map((tag, i) => (
                      <li className="flex rounded-md bg-blue-400 text-white px-2 h-full space-x-2 mr-2" key={tag}>
                        {tag}
                        <p className="ml-2 cursor-pointer text-red-900" onClick={() => {removeTag(i)}}>x</p>
                      </li>
                    ))
                  }

                  {
                    tags.length < 6 &&
                    <input className="focus:outline-none bg-transparent" type="text" ref={textInput} onKeyDown={inputKeyDown}/>
                  }
                  <li>
                  </li>
                </ul>
              </div>
            </div>
            <div className="w-full mt-2 flex justify-end">
              <p className="text-sm">{Math.abs(tags.length - 6)} Remaining</p>
            </div>
          </div>
          
          {/* TITLE */}
          <div className="flex flex-col justify-end mt-2">
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="focus:outline-none focus:ring focus:border-blue-600  w-full px-4 py-3 bg-gray-200 shadow-lg rounded-lg"
              placeholder="Tulis Judul di sini"
            />
            <p className="mt-2 text-sm ml-auto">{title ? 70 - title.length : 70} Remaining</p>
          </div>
          

          {/* KEYWORDS */}
          <div className="flex flex-col justify-end mt-2">
            <input
              value={keywords}
              onChange={e => setKeywords(e.target.value)}
              className="focus:outline-none focus:ring focus:border-blue-600  w-full px-4 py-3 bg-gray-200 shadow-lg rounded-lg"
              placeholder="Tulis Keywords di sini"
            />
            <p className="mt-2 text-sm ml-auto">{keywords ? 255 - keywords.length : 255} Remaining</p>
          </div>

          {/* METATAG */}
          <div className="flex flex-col justify-end mt-2">
            <input
              value={metaTag}
              onChange={e => setMetaTag(e.target.value)}
              className="focus:outline-none focus:ring focus:border-blue-600  w-full px-4 py-3 bg-gray-200 shadow-lg rounded-lg"
              placeholder="Tulis Meta Tag di sini"
            />
            <p className="mt-2 text-sm ml-auto">{metaTag ? 360 - metaTag.length : 360} Remaining</p>
          </div>

          {/* exerpt */}
          <div className="flex flex-col justify-end mt-2">
            <input
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              className="focus:outline-none focus:ring focus:border-blue-600  w-full px-4 py-3 bg-gray-200 shadow-lg rounded-lg"
              placeholder="Tulis excerpt di sini"
            />
            <p className="mt-2 text-sm ml-auto">{excerpt ? 60 - excerpt.length : 60} Remaining</p>
          </div>

          <div className="w-full mt-2 mb-2 flex flex-col items-center justify-center">
            <div className={`flex justify-center items-center px-4 w-full mb-2 py-3 ${!objContent[0].preview ? 'bg-gradient-to-r from-green-400 to-blue-500' : 'bg-gradient-to-r from-yellow-600 to-yellow-400'} text-white rounded-lg cursor-pointer`} onClick={() => setShowUpload(0)}>
              <p>{objContent[0].preview ? 'Edit Image' : 'Add Image'}</p>
            </div>

            {
              objContent[0].preview &&
              <img className="w-96 h-72" src={objContent[0].preview}/>
            }
          </div>
            
          <Editor
          id="edit-base"
          className="mt-5"
          apiKey="2e0yjxplumg5puo5wgalg8wd14bx1g07qmu4z6fohe3u7pb2"
         initialValue="<p>This is the initial content of the editor</p>"
         init={{
           height: 200,
           menubar: false,
           plugins: [
             'advlist autolink lists link image charmap print preview anchor',
             'searchreplace visualblocks code fullscreen',
             'insertdatetime media table paste code help wordcount'
           ],
           toolbar:
             'undo redo | formatselect | bold italic backcolor | \
             alignleft aligncenter alignright alignjustify | \
             bullist numlist outdent indent | removeformat | help'
         }}
         onEditorChange={handleEditorChange}
       />


         {
           objContent[0] &&
           objContent.map((obj, idx) => {
            if (obj.type === 'section') {
              return (
                <div key={idx} className="mt-8 relative py-4">
                  <button onClick={() => removeObj(idx, obj.id)} className="focus:outline-none absolute w-8 rounded-full h-8 flex justify-center items-center z-30 bg-red-600 top-4 -right-4"><FontAwesomeIcon size="lg" color="white" icon={["fas", "times"]} /></button>
                  <div className="flex flex-col justify-end mt-2">
                    <input
                      value={obj.subTitle}
                      onChange={e => mutateContent('subTitle', e.target.value, obj.id)}
                      className="focus:outline-none focus:ring focus:border-blue-600  w-full px-4 py-3 bg-gray-200 shadow-lg rounded-lg"
                      placeholder="Tulis sub title di sini"
                    />
                    <p className="mt-2 text-sm ml-auto">{obj.subTitle ? 60 - obj.subTitle.length : 60} Remaining</p>
                  </div>

                  <div className="w-full mt-6 mb-6 flex flex-col items-center justify-center">
                    <button className={`focus:outline-none w-full px-4 mb-2 py-3 ${!obj.preview ? 'bg-gradient-to-r from-green-400 to-blue-500' : 'bg-gradient-to-r from-yellow-600 to-yellow-400'} text-white rounded-lg cursor-pointer`} onClick={() => setShowUpload(idx)}>
                      <p>{obj.preview ? 'Edit Image' : 'Add Image'}</p>
                    </button>

                    {
                      obj.preview &&
                      <img className="w-96 h-72" src={obj.preview}/>
                    }
                  </div>

                  <Editor
                    id={`edit-${idx}`}
                    className="mt-5"
                    apiKey="2e0yjxplumg5puo5wgalg8wd14bx1g07qmu4z6fohe3u7pb2"
                    initialValue="<p>This is the initial content of the editor</p>"
                    init={{
                      height: 200,
                      menubar: false,
                      plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                      ],
                      toolbar:
                        'undo redo | formatselect | bold italic backcolor | \
                        alignleft aligncenter alignright alignjustify | \
                        bullist numlist outdent indent | removeformat | help'
                    }}
                    onEditorChange={handleEditorChange}
                  />
                </div>
              )
            } else if (obj.type === 'paragraph') {
              return (
                <div key={idx} className="mt-8 relative py-2">
                  <button onClick={() => removeObj(idx, obj.id)} className="focus:outline-none absolute w-8 rounded-full h-8 flex justify-center items-center z-30 bg-red-600 top-4 -right-4"><FontAwesomeIcon size="lg" color="white" icon={["fas", "times"]} /></button>
                <Editor
                    id={`edit-${idx}`}
                    className="mt-5"
                    apiKey="2e0yjxplumg5puo5wgalg8wd14bx1g07qmu4z6fohe3u7pb2"
                    initialValue="<p>This is the initial content of the editor</p>"
                    init={{
                      height: 200,
                      menubar: false,
                      plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                      ],
                      toolbar:
                        'undo redo | formatselect | bold italic backcolor | \
                        alignleft aligncenter alignright alignjustify | \
                        bullist numlist outdent indent | removeformat | help'
                    }}
                    onEditorChange={handleEditorChange}
                  />
                  </div>
              )
            } else if (obj.type === 'subtitle') {
              return (
                <div key={idx} className="mt-8 relative py-2">
                  <button onClick={() => removeObj(idx, obj.id)} className="focus:outline-none absolute w-8 rounded-full h-8 flex justify-center items-center z-30 bg-red-600 top-4 -right-4"><FontAwesomeIcon size="lg" color="white" icon={["fas", "times"]} /></button>
                <div className="flex flex-col justify-end mt-2">
                  <input
                    value={obj.subTitle}
                    onChange={e => mutateContent('subTitle', e.target.value, obj.id)}
                    className="focus:outline-none focus:ring focus:border-blue-600  w-full px-4 py-3 bg-gray-200 shadow-lg rounded-lg"
                    placeholder="Tulis sub title di sini"
                  />
                  <p className="mt-2 text-sm ml-auto">{obj.subTitle ? 60 - obj.subTitle.length : 60} Remaining</p>
                </div>
                </div>
              )
            } else if (obj.type === 'image') {
              return (
                <div key={idx} className="mt-8 relative py-2">
                  <button onClick={() => removeObj(idx, obj.id)} className="focus:outline-none absolute w-8 rounded-full h-8 flex justify-center items-center z-30 bg-red-600 top-4 -right-4"><FontAwesomeIcon size="lg" color="white" icon={["fas", "times"]} /></button>
                <div className="w-full mt-2 mb-2 flex flex-col items-center justify-center">
                  <button className={`w-full focus:outline-none px-4 mb-2 py-3 ${!obj.preview ? 'bg-gradient-to-r from-green-400 to-blue-500' : 'bg-gradient-to-r from-yellow-600 to-yellow-400'} text-white rounded-lg cursor-pointer`} onClick={() => setShowUpload(idx)}>
                    <p>{obj.preview ? 'Edit Image' : 'Add Image'}</p>
                  </button>

                  {
                    obj.preview &&
                    <img className="w-96 h-72" src={obj.preview}/>
                  }
                </div>
                </div>
              )
            }
           })
         }


          <div className="w-full mt-12">
            <div className="w-full h-12 flex justify-center space-x-4 items-center">
              <div onClick={() => addSection('section')} className="flex justify-center items-center focus:outline-none h-full rounded-xl w-3/12 bg-green-500 text-white"><p>Add Section Article</p></div>
              <div onClick={() => addSection('subtitle')} className="flex justify-center items-center focus:outline-none h-full rounded-xl w-3/12 bg-green-500 text-white"><p>Add Sub Title</p></div>
              <div onClick={() => addSection('image')} className="flex justify-center items-center focus:outline-none h-full rounded-xl w-3/12 bg-green-500 text-white"><p>Add Image Headers</p></div>
              <div onClick={() => addSection('paragraph')} className="flex justify-center items-center focus:outline-none h-full rounded-xl w-3/12 bg-green-500 text-white"><p>Add Paragraph</p></div>
            </div>

            <button onClick={e => postArticle(e).then(response => catchResponse(response))} className="w-full mt-3 rounded-xl h-12 bg-green-500">
              <p className="text-white">Save Article</p>
            </button>
          </div>
        </div>
      </MainLayout>
    </>
  )
}
