import { useEffect, useState } from 'react'
import { supabase } from "../supabase/SupabaseClient"
import toast from 'react-hot-toast'

export default function Recipes() {
  const [user, setUser] = useState(null)
  const [recipes, setRecipes] = useState([])
  const [selected, setSelected] = useState(null) // for detail view

  // Form states
  const [title, setTitle] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [instructions, setInstructions] = useState('')
  const [tags, setTags] = useState([])
  const [newTag, setNewTag] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState(null)

  // Init user & subscribe
  useEffect(() => {
    let channel
    supabase.auth.getUser().then(({ data }) => {
      const u = data?.user
      if (u) {
        setUser(u)
        load(u)
        channel = supabase
          .channel('recipes-ch')
          .on('postgres_changes', {
            event: '*', schema: 'public', table: 'recipes', filter: `user_id=eq.${u.id}`
          }, () => load(u))
          .subscribe()
      }
    })
    return () => channel && supabase.removeChannel(channel)
  }, [])

  // Load recipes and normalize tags
  const load = async (u) => {
    const { data } = await supabase
      .from('recipes')
      .select('*')
      .eq('user_id', u.id)
      .order('created_at', { ascending: false })

    const normalized = (data || []).map(r => ({
      ...r,
      tags: Array.isArray(r.tags) ? r.tags : (r.tags ? r.tags.split(',').map(t => t.trim()) : [])
    }))
    setRecipes(normalized)
  }

  // Tag handlers
  const addTag = () => {
    const t = newTag.trim()
    if (t && !tags.includes(t)) setTags([...tags, t])
    setNewTag('')
  }
  const removeTag = i => setTags(tags.filter((_, idx) => idx !== i))
  const onTagKey = e => e.key === 'Enter' && (e.preventDefault(), addTag())

  // Image upload/delete
  const uploadImage = async f => {
    const ext = f.name.split('.').pop()
    const name = `${user.id}/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('recipe-images').upload(name, f)
    if (error) return toast.error('Upload failed'), null
    const { data } = supabase.storage.from('recipe-images').getPublicUrl(name)
    return data.publicUrl
  }
  const deleteOld = async id => {
    const { data } = await supabase.from('recipes').select('image_url').eq('id', id).single()
    if (data?.image_url) {
      const p = data.image_url.split('/public/recipe-images/')[1]
      p && await supabase.storage.from('recipe-images').remove([p])
    }
  }

  // Submit create/update
  const onSubmit = async e => {
    e.preventDefault()
    if (!title) return
    const toastId = toast.loading(isEditing ? 'Updating...' : 'Adding...')
    let url = null
    if (isEditing && imageFile) await deleteOld(editId)
    if (imageFile) url = await uploadImage(imageFile), setImagePreview(url)

    const data = { title, ingredients, instructions, tags }
    if (url) data.image_url = url

    let err
    if (isEditing) ({ error: err } = await supabase.from('recipes').update(data).eq('id', editId))
    else ({ error: err } = await supabase.from('recipes').insert({ ...data, user_id: user.id }))

    if (err) toast.error('Error saving', { id: toastId })
    else {
      toast.success(isEditing ? 'Updated!' : 'Added!', { id: toastId })
      reset()
      load(user)
    }
  }

  const reset = () => {
    setTitle(''); setIngredients(''); setInstructions('')
    setTags([]); setNewTag(''); setImageFile(null); setImagePreview(null)
    setIsEditing(false); setEditId(null)
  }

  // Edit handler normalizes tags
  const onEdit = r => {
    setIsEditing(true)
    setEditId(r.id)
    setTitle(r.title)
    setIngredients(r.ingredients)
    setInstructions(r.instructions)
    // Normalize r.tags into array
    const initialTags = Array.isArray(r.tags)
      ? r.tags
      : (r.tags ? r.tags.split(',').map(t => t.trim()) : [])
    setTags(initialTags)
    setImagePreview(r.image_url)
    setImageFile(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const onDelete = async id => {
    if (window.confirm('Delete?')) {
      await deleteOld(id)
      const { error } = await supabase.from('recipes').delete().eq('id', id)
      error ? toast.error('Delete failed') : toast.success('Deleted'), load(user)
    }
  }

  // Detail view
  if (selected) return (
    <div className="container" style={{ padding: '2rem' }}>
      <button onClick={() => setSelected(null)} style={{ marginBottom: '1rem', background:'none',border:'none',cursor:'pointer',fontSize:24 }}>← Back</button>
      <h1>{selected.title}</h1>
      {selected.image_url && <img src={selected.image_url} alt="" style={{width:'100%',borderRadius:8,margin:'1rem 0'}} />}
      <p><strong>Ingredients:</strong><br/>{selected.ingredients}</p>
      <p><strong>Instructions:</strong><br/>{selected.instructions}</p>
      <div><strong>Tags:</strong></div>
{(selected.tags || []).map((tag, idx) => (
  <div key={idx}>{tag}</div>
))}
    </div>
  )

  // Main list + form
  return (
    <div className="container">
      <h2>{isEditing ? 'Edit' : 'Create'} Recipe</h2>
      <form onSubmit={onSubmit}>
        {imagePreview && <img src={imagePreview} alt="" style={{width:'100%',borderRadius:8,margin:'1rem 0'}} />}
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <textarea placeholder="Ingredients" value={ingredients} onChange={e => setIngredients(e.target.value)} />
        <textarea placeholder="Instructions" value={instructions} onChange={e => setInstructions(e.target.value)} />
        <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:8}}>
          {tags.map((t,i) => (
            <span key={i} style={{background:'#ddd',padding:'4px 8px',borderRadius:4,display:'flex',alignItems:'center'}}>
              {t}<button type="button" onClick={() => removeTag(i)} style={{marginLeft:4,border:'none',background:'transparent',cursor:'pointer'}}>×</button>
            </span>
          ))}
          <input placeholder="New tag" value={newTag} onChange={e => setNewTag(e.target.value)} onKeyDown={onTagKey} style={{flex:1,minWidth:100}} />
          <button type="button" onClick={addTag}>+</button>
        </div>
        <input type="file" accept="image/*" onChange={e => { setImageFile(e.target.files[0]); setImagePreview(URL.createObjectURL(e.target.files[0])); }} />
        <button type="submit" style={{marginTop:8}}>{isEditing?'Update':'Add'}</button>
        {isEditing && <button type="button" onClick={reset} style={{marginLeft:8}}>Cancel</button>}
      </form>

      <h2 style={{marginTop:32}}>Your Recipes</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:16}}>
        {recipes.map(r => (
          <div key={r.id} style={{boxShadow:'0 2px 8px rgba(0,0,0,0.1)',borderRadius:8,overflow:'hidden',background:'#fff',cursor:'pointer'}}>
            {r.image_url && <img src={r.image_url} alt="" style={{width:'100%',height:150,objectFit:'cover'}} onClick={() => setSelected(r)} />}
            <div style={{padding:16}}>
              <h3 style={{margin:'0 0 8px 0'}} onClick={() => setSelected(r)}>{r.title}</h3>
              <button onClick={() => onEdit(r)}>Edit</button>
              {!isEditing && <button onClick={() => onDelete(r.id)} style={{marginLeft:8,color:'red'}}>Delete</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
