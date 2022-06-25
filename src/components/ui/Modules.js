import { useState, useEffect } from 'react';

import { apiRequest } from '../api/apiRequest.js';

import './Modules.css'

import Card from './Card';
import Favourites from '../pages/Favourites';
import Favourite from './Favourite';
import Form from './Form';
import Edit from './Edit';

function Modules() {
    // Properties
    const API_URL = 'https://my.api.mockaroo.com/';
    const API_KEY = '?key=bb6adbc0';

    // Hooks
    const [loadingMessage, setLoadingMessage] = useState("Loading records ...");
    const [modules, setModules] = useState(null);

    const [ favourites, setFavourites ] = useState([]);

    const [ editingModule, setEditingModule ] = useState(null);

    // Methods
    function deleteModule(moduleId) {
        const newModules = modules.filter((each) => each.ModuleID !== moduleId)
        setModules(newModules); 
    }
    function addModule(module) {
        setModules([...modules, module]); 
    }

    function closeEditForm() {
        setEditingModule(null);
    }
    function isEditing(moduleId) {
        return moduleId === editingModule;
    }
    function selectEditModule(moduleId) {
        setEditingModule(moduleId); 
    }

    function addFavourite(moduleId) {
        moduleId = getIndex(moduleId);
        setFavourites([...favourites, moduleId]); 
    }

    function removeFavourite(moduleId) {
        moduleId = getIndex(moduleId);
        const newFavourites = favourites.filter(each => each !== moduleId);

        setFavourites(newFavourites);
    }

    const getIndex = (id) => {
        return modules.findIndex(module => module.ModuleID === id)+1;
    }

    const getNewModuleID = () => {
        return modules.at(-1).ModuleID+1;
    }

    // Context
    useEffect(() => { fetchModules() }, []);

    const fetchModules = async () => {

        const outcome = await apiRequest(API_URL, 'Modules', API_KEY);

        if (outcome.success) setModules (outcome.response);

        else setLoadingMessage(`Error ${outcome.response.status}: Modules could not be found.`);

    }

    // View
    return (
        <div className='modules'>
            MODULES
            <div className='cardContainer'>
            {modules 
            ? 
            modules.map((module) => (
                isEditing(module.ModuleID) ? 
                <Edit onCloseEditForm={() => closeEditForm()} key={null}/>
                :
                <Card module={module} key={module.ModuleID} 
                    ModuleID = {module.ModuleID}
                    onDeleteModule={(ModuleID) => deleteModule(ModuleID)}
                    onSelectEditModule={(ModuleID) => selectEditModule(ModuleID)}
                    onAddFavourite={(ModuleID) => addFavourite(ModuleID)}
                    onRemoveFavourite={(ModuleID) => removeFavourite(ModuleID)}
                />
            ))
            : loadingMessage
            }
            <Form onAddModule={(module) => addModule(module)} newModuleID={getNewModuleID}/>
            <Favourites>
                {favourites.map((favourite) => (
                    <Favourite 
                        module={modules[favourite-1]} 
                        favourite={favourite} 
                    />        
                ))}
            </Favourites>
            </div>
        </div>
    )

}

export default Modules;