import React, { useState } from 'react';
import { api } from '../../api';
import { uploadToCloudinary } from '../../services/cloudinary';

const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;

const ProjectFormModal = ({ onClose, onProjectCreated, showMessage }) => {
    const [name, setName] = useState('');
    const [value, setValue] = useState('');
    const [photo, setPhoto] = useState(null); 

    const [fields, setFields] = useState([{ label: '', fieldType: 'TEXT', options: '' }]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const addField = () => {
        setFields([...fields, { label: '', fieldType: 'TEXT', options: '' }]);
    };
    const removeField = (index) => {
        const newFields = fields.filter((_, i) => i !== index);
        setFields(newFields);
    };
    const handleFieldChange = (index, event) => {
        const newFields = [...fields];
        newFields[index][event.target.name] = event.target.value;
        setFields(newFields);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            let imageUrl = null;
            if (photo) {
                showMessage('Uploading project photo...', 'success');
                imageUrl = await uploadToCloudinary(photo);
                showMessage('Photo uploaded successfully!', 'success');
            }
            const projectData = { 
                name, 
                value: Number(value), 
                photo: imageUrl, 
                fields: fields.map(f => ({
                    ...f, 
                    options: f.fieldType === 'RADIO' ? f.options.split(',').map(opt => opt.trim()) : undefined 
                }))
            };
            const res = await api.createProject(projectData);
            onProjectCreated(res.project);
        } catch (error) {
            showMessage(error.message || "Failed to create project. Please check the console.", 'error');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
            <div className="glassmorphism rounded-xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-c-chocolate/50">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-c-white uppercase tracking-wider">New Project Protocol</h2>
                    <button onClick={onClose} className="text-c-slate hover:text-c-white">
                        <CloseIcon />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Project Name" value={name} onChange={e => setName(e.target.value)} className="futuristic-input w-full" required />
                    <input type="number" placeholder="Value (Rp)" value={value} onChange={e => setValue(e.target.value)} className="futuristic-input w-full" required />
                    
                    <div>
                        <label className="text-sm font-semibold text-c-slate mb-2 block">Project Photo (Optional)</label>
                        <label htmlFor="photo-upload" className="futuristic-input w-full flex items-center justify-center gap-3 cursor-pointer hover:border-c-chocolate transition-colors">
                            <UploadIcon />
                            <span>{photo ? photo.name : 'Select a file'}</span>
                        </label>
                        <input id="photo-upload" type="file" className="hidden" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} />
                    </div>

                    <hr className="my-4 border-c-lightest-navy/20" />
                    
                    <h3 className="text-lg font-semibold text-c-light-slate">Data Fields</h3>
                    <div className="space-y-3">
                        {fields.map((field, index) => (
                            <div key={index} className="p-4 border border-c-lightest-navy/20 rounded-lg space-y-3 relative bg-c-light-navy/30">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="text" name="label" placeholder="Field Label" value={field.label} onChange={e => handleFieldChange(index, e)} className="futuristic-input w-full p-2 rounded" required/>
                                    <select name="fieldType" value={field.fieldType} onChange={e => handleFieldChange(index, e)} className="futuristic-input w-full p-2 rounded">
                                        <option value="TEXT">TEXT</option>
                                        <option value="PHOTO">PHOTO</option>
                                        <option value="NUMBER">NUMBER</option>
                                        <option value="RADIO">RADIO</option>
                                    </select>
                                </div>
                                {field.fieldType === 'RADIO' && (
                                    <input type="text" name="options" value={field.options} placeholder="Options (comma separated)" onChange={e => handleFieldChange(index, e)} className="futuristic-input w-full p-2 rounded" required />
                                )}
                                <button type="button" onClick={() => removeField(index)} className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full p-1 shadow-lg hover:bg-red-500">
                                    <TrashIcon />
                                </button>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addField} className="text-sm text-c-chocolate hover:underline font-semibold">
                        + Add Field
                    </button>
                    
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="text-c-slate hover:text-white px-4 py-2 rounded-lg">Cancel</button>
                        <button type="submit" className="futuristic-btn" disabled={isSubmitting}>
                            {isSubmitting ? "CREATING..." : "CREATE"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectFormModal;
