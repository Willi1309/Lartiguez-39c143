import { useAuth } from "../../context/authContext"
import { IoPersonCircleOutline, IoHeartOutline, IoHeartSharp } from "react-icons/io5"
import { SignOutApi } from "../../api/auth"
import { useNavigate } from "react-router-dom"
import { FiEdit } from "react-icons/fi"
import { TiDeleteOutline } from "react-icons/ti"
import { createCategoryApi, deleteCategoryApi, getCategoriesApi } from "../../api/categories"
import { useEffect, useState, useMemo } from "react"
import { createNoteApi, getNotesApi, deleteNoteApi, archiveNoteApi, editNoteApi } from "../../api/notes"
import { LuEye } from "react-icons/lu";
import type { Categories, Note } from "../../../types"
import Swal from "sweetalert2"
import './main.css'

export default function Main(){
    const [categories, setCategories] = useState<Categories[]>([])
    const [notes, setNotes] = useState<Note[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [filterStatus, setFilterStatus] = useState<'filed' | 'unfiled' | null>(null)
    const auth = useAuth()
    const navigate = useNavigate()

    const q = searchQuery.trim().toLowerCase()

    const filtered = useMemo(() => {
        let result = notes
        if (selectedCategory) {
            result = result.filter(note => note.category === selectedCategory)
        }

        if (filterStatus === 'filed') {
            result = result.filter(note => note.archived === true);
        } else if (filterStatus === 'unfiled') {
            result = result.filter(note => !note.archived)
        }

        if (q !== '') {
            result = result.filter(note => {
                const combined = [note.title, note.body, note.category].filter(Boolean).join(' ').toLowerCase()
                return combined.includes(q)
            });
        }

        return result
    }, [notes, selectedCategory, q, filterStatus])

    const HandleSignout = () => {
        Swal.fire({
            title: "Desea cerrar sesión?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#28a745",
            confirmButtonText: "Si",
            cancelButtonText: "No"
        }).then(async (result)=>{
            if(result.isConfirmed){
                const token = auth.getRefreshToken()
                if(token){
                    try {
                        await SignOutApi(token);
                    } catch (error) {
                        console.error("La API falló, pero forzaremos el cierre de sesión local", error);
                    } finally {
                        auth.signOut(); 
                        navigate('/');
                    }
                }
            }
        })        
    }

    const handleCreateNote = async (categories: Categories[]) => {
        const optionsHtml = categories.map(cat => 
            `<option value="${cat.category}">${cat.category}</option>`
        ).join('');

        const { value: formValues } = await Swal.fire({
            title: 'Nueva Nota',
            html: `
                <input id="swal-title" class="swal2-input" placeholder="Título">
                <textarea id="swal-body" class="swal2-textarea" placeholder="Cuerpo de la nota"></textarea>
                <select id="swal-category" class="swal2-select" style="display: flex; width: 80%;">
                    <option value="" disabled selected>Selecciona una categoría</option>
                    ${optionsHtml}
                </select>
            `,
            focusConfirm: false,
            preConfirm: () => {
                return {
                    title: (document.getElementById('swal-title') as HTMLInputElement).value,
                    body: (document.getElementById('swal-body') as HTMLTextAreaElement).value,
                    category: (document.getElementById('swal-category') as HTMLSelectElement).value
                };
            },
            confirmButtonText: 'Crear Nota',
            confirmButtonColor: '#1bb918'
        })

        if (formValues && formValues.title && formValues.category) {
            try{    
                const newNote = await createNoteApi(auth.getAccessToken(), formValues);
                
                // Actualización local: añadimos la nueva nota al array de notas
                setNotes(prev => [...prev, newNote]);
                Swal.fire({ 
                    title: "Exito!", 
                    text: "Nota creada exitosamente", 
                    icon: "success" 
                })
            }catch(error){
                console.error(error)
            }
        }
    }

    const handleDeleteNote = (id_note: number) =>{
        Swal.fire({
            icon: 'question',
            title: '¿Desea borrar esta nota?',
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            showConfirmButton: true,
            confirmButtonText: "Aceptar",
        }).then(async(result)=>{
            if(result.isConfirmed){
                await deleteNoteApi(id_note, auth.getAccessToken())
                setNotes(prev => prev.filter(n => n.id_note !== id_note))           
                Swal.fire("Exito!", "Nota borrada exitosamente", "success")
            }
        })
    }
    const handleDeleteCategory = (categoryName: string) =>{
        Swal.fire({
            icon: 'question',
            title: '¿Desea borrar esta categoria?',
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            showConfirmButton: true,
            confirmButtonText: "Aceptar",
        }).then(async(result)=>{
            if(result.isConfirmed){
                try{
                    await deleteCategoryApi(auth.getAccessToken(), categoryName)
                    setCategories(prev => prev.filter(c => c.category !== categoryName));
                    Swal.fire("Exito!", "Categoria borrada exitosamente", "success")
                }catch(error: any){
                    if (error.status === 409) {
                        Swal.fire("Error", "No puedes borrar una categoría que tiene notas activas.", "error");
                    } else {
                        Swal.fire("Error", "No se pudo eliminar la categoría.", "error");
                    }
                }
                
            }
        })
    }

    const handleAddCategory = async () => {
        const { value: categoryName } = await Swal.fire({
            title: 'Nueva Categoría',
            input: 'text',
            inputLabel: 'Nombre de la categoría',
            inputPlaceholder: 'Ej: Trabajo, Personal...',
            showCancelButton: true,
            confirmButtonText: 'Crear',
            confirmButtonColor: '#1bb918',
            cancelButtonText: 'Cancelar',
            cancelButtonColor: '#1e5edd',
            inputValidator: (value) => {
                if (!value) return '¡Necesitas escribir un nombre!'
            }
        })

        if (categoryName) {
            try {
                
                await createCategoryApi(auth.getAccessToken(), categoryName)
                setCategories(prev => [...prev, { category: categoryName }]);
                Swal.fire("Exito!", "Categoria creada exitosamente", "success")
            } catch (error: any) {
                if (error.message === "CATEGORY_EXISTS") {
                    Swal.fire( "ERROR!", "La categoria ya existe", "error" )
                } else {
                    console.error(error)
                }
            }
        }
    }

    const handleEditNote = async (note: Note) => {
        const optionsHtml = categories.map(cat => 
            `<option value="${cat.category}" ${cat.category === note.category ? 'selected' : ''}>
                ${cat.category}
            </option>`
        ).join('')

        const { value: formValues } = await Swal.fire({
            title: 'Editar Nota',
            html:
                `<input id="swal-input1" class="swal2-input" placeholder="Título" value="${note.title}">` +
                `<select id="swal-category" class="swal2-select" style="display: flex; width: 80%;">
                    ${optionsHtml}
                </select>` +
                `<textarea id="swal-input3" class="swal2-textarea" placeholder="Cuerpo">${note.body}</textarea>`,
            focusConfirm: false,
            preConfirm: () => {
                return {
                    title: (document.getElementById('swal-input1') as HTMLInputElement).value,
                    category: (document.getElementById('swal-category') as HTMLSelectElement).value,
                    body: (document.getElementById('swal-input3') as HTMLTextAreaElement).value,
                }
            }
        })

        if (formValues) {
            try {
                const updatedNote = {
                    ...note,
                    ...formValues
                };
                await editNoteApi(auth.getAccessToken(), updatedNote)
                setNotes(prevNotes => 
                    prevNotes.map(n => n.id_note === note.id_note ? { ...n, ...formValues } : n)
                )
                Swal.fire('Guardado!', 'La nota ha sido actualizada', 'success');
            } catch (error) {
                Swal.fire('Error', 'No se pudo actualizar la nota', 'error');
            }
        }
    }

    const handleViewNote = (note: Note) => {
        Swal.fire({
            title: note.title,
            text: note.body,
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#1e5edd',
        })
    }

    const handleToggleFilter = (status: 'filed' | 'unfiled') => {
        setFilterStatus(prev => (prev === status ? null : status));
    }

    const handleArchiveNote = async (note: Note) => {
        const previousNotes = [...notes];
        setNotes(prevNotes => 
            prevNotes.map(n => n.id_note === note.id_note ? { ...n, archived: !n.archived } : n)
        );

        try {
            await archiveNoteApi(note.id_note, !note.archived, auth.getAccessToken())
            
        } catch (error) {
            console.error("No se pudo guardar el estado:", error);
            setNotes(previousNotes); 
        }
    }

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [categoriesData, notesData] = await Promise.all([
                    getCategoriesApi(auth.getAccessToken()),
                    getNotesApi(auth.getAccessToken())
                ]);
                setCategories(categoriesData);
                setNotes(notesData);
            } catch (error) {
                console.error("Error al cargar datos iniciales", error);
            }
        };
        loadInitialData();
    }, [])

    return (
        <div className="main">
            <header className="main-header">
                <div className="title-header">
                    <h2>Challenge Full Stack</h2>
                </div>
                <div className="icon-signout">
                    <div className="icon-header">
                        <IoPersonCircleOutline className="icon-user" />
                        <p>{auth.getUser()?.user || ""}</p>
                    </div>
                    <div className="signup-header-button">
                        <button onClick={HandleSignout}>Sign out</button>
                    </div>
                </div>
            </header>
            
            <div className="main-box">
                <div className="main-content-layout">
                    <div className="categories-sidebar">
                        <h3>Categories</h3>
                        <div className="categories-list">
                            <ul>
                                <li onClick={() => setSelectedCategory(null)} className={selectedCategory === null ? 'active' : ''}>
                                    All categories
                                </li>
                                {categories.map((category, index) => (<div  key={index}  style={{display: 'flex', alignItems: 'center'}}>
                                    <TiDeleteOutline className="icon-delete" style={{cursor: 'pointer'}} onClick={()=>handleDeleteCategory(category.category)}/>
                                    <li style={{display: 'flex', width: '100%', cursor: 'pointer'}} className={selectedCategory === category.category ? 'active' : ''} onClick={() => setSelectedCategory(category.category)}>
                                        {category.category}
                                    </li>
                                </div>))}
                            </ul>
                        </div>
                    </div>

                    <div className="main-right-panel">
                        <div className="searcher-add">
                            <input className="input-searcher" type="text" placeholder="Buscar" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value) }} />
                            <button className="button-add" onClick={()=>handleCreateNote(categories)}>Add note</button>
                            <button className="button-add" onClick={handleAddCategory}>Add Category</button>
                            <button className={`button-filed ${filterStatus === 'filed' ? 'active' : ''}`} onClick={() => handleToggleFilter('filed')}>Filed</button>
                            <button className={`button-unfiled ${filterStatus === 'unfiled' ? 'active' : ''}`} onClick={() => handleToggleFilter('unfiled')}>Unfiled</button>
                        </div>
                        <div className="notes">
                            {filtered.length === 0 ? (
                                <p>No hay notas que coincidan</p>
                            ) : (filtered.map((note)=>(
                                <div className="note" key={note.id_note}>
                                    <div className="note-header">
                                        <div className="icon-box-note" onClick={() => handleArchiveNote(note)}>
                                            {note.archived ? (
                                                <IoHeartSharp  className="icon-heart-filled" />
                                            ) : (
                                                <IoHeartOutline className="icon-heart" />
                                            )}
                                        </div>
                                        <div className="note-title"><h3>{note.title}</h3></div>
                                        <div className="icon-box-note"><FiEdit className="icon-edit" onClick={()=>handleEditNote(note)}/></div>
                                        <div className="icon-box-note"><TiDeleteOutline className="icon-delete" onClick={()=>handleDeleteNote(note.id_note)}/></div>
                                    </div>
                                    <div className="note-category"><h3>{note.category}</h3></div>
                                    <div className="note-body-container">
                                        <div className="note-body">
                                            <p>{note.body}</p>
                                        </div>
                                        <div className="icon-view-container">
                                            <div className="icon-box-note" onClick={() => handleViewNote(note) }>
                                                <LuEye  className="icon-view" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )))} 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}