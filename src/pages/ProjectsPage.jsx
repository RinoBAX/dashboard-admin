import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import { useAuth } from '../hooks/useAuth';

import ProjectFormModal from '../components/projects/ProjectFormModal';
import LoadingComponent from '../components/common/LoadingComponent';
import ErrorComponent from '../components/common/ErrorComponent';

const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>;


const ProjectsPage = ({ showMessage }) => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState(null);

    const fetchProjects = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await api.getProjects();
            setProjects(data);
        } catch (err) {
            const errorMessage = err.message || 'Failed to fetch project data.';
            setError(errorMessage);
            showMessage(errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [showMessage]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleProjectCreated = (newProject) => {
        setProjects(prevProjects => [newProject, ...prevProjects]);
        setIsModalOpen(false);
        showMessage('Project protocol initiated successfully!');
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold text-c-white uppercase">Project Protocols</h1>
                <button 
                    onClick={() => setIsModalOpen(true)} 
                    className="futuristic-btn"
                >
                    <PlusIcon className="inline-block mr-2 h-5 w-5"/>
                    New Protocol
                </button>
            </div>
            
            {isLoading && <LoadingComponent text="ACCESSING PROJECT DATABASE" />}
            {error && <ErrorComponent text={error} />}
            {!isLoading && !error && (
                <div className="glassmorphism rounded-lg overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-c-light-navy/50">
                            <tr>
                               {['Project Photo', 'Project Name', 'Value', 'Created By', 'Actions'].map(h => (
                                    <th key={h} className="px-6 py-3 text-left text-sm font-semibold text-c-chocolate uppercase tracking-wider">{h}</th>
                               ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-c-lightest-navy/20">
                            {projects.map(p => (
                                <tr key={p.id} className="hover:bg-c-lightest-navy/10 transition-colors">
                                    <td className="px-6 py-4">
                                        <img 
                                            src={p.photo || 'https://placehold.co/60x40/0a192f/a8b2d1?text=No+Img'} 
                                            alt={p.name}
                                            className="h-10 w-16 object-cover rounded-md"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-c-white">{p.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-c-light-slate">Rp{Number(p.value).toLocaleString('id-ID')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-c-light-slate">{p.createdBy?.username || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-right">
                                        <button className="text-red-500 hover:text-red-400 hover:shadow-lg hover:shadow-red-500/20 rounded-full p-2 transition-all">
                                            <TrashIcon />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <ProjectFormModal 
                    onClose={() => setIsModalOpen(false)} 
                    onProjectCreated={handleProjectCreated} 
                    showMessage={showMessage} 
                />
            )}
        </div>
    );
};

export default ProjectsPage;
