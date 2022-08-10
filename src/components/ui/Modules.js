import './Modules.css'
import { useState, useEffect } from 'react';
import Favourites from '../pages/Favourites.js';
import Form from './Form.js';
import Edit from './Edit.js';
import Backdrop from './Backdrop.js';
import Modal from './Modal.js';
import Module from './Module.js';
import { Records, LoadingMessage } from '../../model/datafiles/getRecords.js'
import Accessor from '../../model/Accessor.js'

function Modules() {
  // PROPERTIES
  const endpointStr = 'Modules'
  const method = 'GET'
  const loadingMessage = LoadingMessage && LoadingMessage
  const accessor = new Accessor({endpointStr})
  const records = Records(endpointStr, method)
  // const modules = records && records
  let consoleLogTest
  
  const [ modalIsOpen, setModalIsOpen ] = useState(false);
  const [ selectedModuleId , selectModuleId ] = useState();
  
  // HOOKS
  const [ moduless, setModules ] = useState(null);
  const [ favourites, setFavourites ] = useState([]);
  const [ editingModule, setEditingModule ] = useState(null);
  const [ test, setTest ] = useState()

  const recordName = 'Module'
  const id_ = `${recordName}ID`; 
  const name_ = `${recordName}Name`; 
  const code_ = `${recordName}Code`; 
  const level_ = `${recordName}Level`; 
  const leaderid_ = `${recordName}LeaderID`; 
  const image_ = `${recordName}ImageURL`;   

  const record = 'example record'
  const id = record[id_]
  const name = record[name_]
  const code = record[code_]
  const level = record[level_]
  const leaderid = record[leaderid_]
  const image = record[image_]

  let data
  const didMount = () => {
    accessor.list().then((result) => { setTest(result.response) } )
  }

  useEffect(() => { didMount() }, [  ] )

  const modules = test && test

  // METHODS
  // consoleLogTest = test 

  const closeEditForm = () => {
    setEditingModule(null);
  }
  const isEditing = (moduleId) => {
    return moduleId === editingModule;
  }
  const selectEditModule = (moduleId) => {
    setEditingModule(moduleId); 
  }

  const addFavourite = (moduleId) => {
    moduleId = getIndex(moduleId);
    const module = modules.at(moduleId-1);
    setFavourites([...favourites, module]); 
  }

  const removeFavourite = (moduleId) => {
    moduleId = getIndex(moduleId);
    const newFavourites = favourites.filter(each => each[id_] !== moduleId);

    setFavourites(newFavourites);
  }

  const getIndex = (id) => {
    return modules.findIndex(module => module[id_] === id)+1;
  }

  const getNewModuleID = () => {
    return (modules.length)+1;
  }
  
  const loadModules = () => { ;}
  const buildErrorModal = () => { ;}
  
  const handleAdd = async (record) => {
    consoleLogTest = await accessor.create(record)
      // .then((response) => console.log(response.result));
    
    // console.log( consoleLogTest.response.text() )
    // console.log( consoleLogTest.response.result )
    
    
    didMount()
  }

  const handleModify = async (record) => {
    consoleLogTest = await accessor.update(record[id_], record);
    
    consoleLogTest.success
      ? loadModules()
      : buildErrorModal("Add Modify Delete module error", consoleLogTest.response);
    didMount()
  }

  const handleDelete = async (id) => {
    consoleLogTest = await accessor.delete(id);
    didMount()
  }
  
  const closeModalHandler = () => {
    setModalIsOpen(false);
  }
  
  const deleteHandler = () => {
    setModalIsOpen(true);
  }

  const doSelectModule = (moduleId) => {
    selectModuleId(moduleId);
  }
  
  consoleLogTest && console.log( consoleLogTest )

  const renderModule = (data) => {
    return (
      <Module 
        key={data[id_]}
        record={data}

        onIconClick={deleteHandler} 
        onSelectDeleteRecord={() => doSelectModule(data[id_])} 

        onSelectEditRecord={() => selectEditModule(data[id_])}

        onUnfavourite={() => removeFavourite(data[id_])}
        onFavourite={() => addFavourite(data[id_])}   
        
        recordType = 'Module'
      ></Module>
    )
  }

  // View
  return (
    <div className='modules'>
      <Favourites>
        {favourites.map((favourite) => (
          <Module 
            key={favourite[id_]}
            record={favourite}

            onIconClick={deleteHandler} 
            onSelectDeleteRecord={() => doSelectModule(favourite[id_])} 

            onSelectEditRecord={() => selectEditModule(favourite[id_])}

            onUnfavourite={() => addFavourite(favourite[id_])}
            onFavourite={() => removeFavourite(favourite[id_])}     
          >
          </Module>    
        ))}
      </Favourites>
      
      MODULES
      <div className='cardContainer'>
      {modules 
      ? 
        modules.map((module) => (
          isEditing(module[id_]) ? 
          <Edit 
            key={module[id_]}
            onCloseEditForm={() => closeEditForm()} 
            record={module}
            onEdit={(module) => handleModify(module)}
            recordType='Module'
          />
          :
          <Module 
            key={module[id_]}
            record={module}

            onIconClick={deleteHandler} 
            onSelectDeleteRecord={() => doSelectModule(module[id_])} 

            onSelectEditRecord={() => selectEditModule(module[id_])}

            onUnfavourite={() => removeFavourite(module[id_])}
            onFavourite={() => addFavourite(module[id_])}   
            
            recordType = 'Module'
          ></Module>
        ))
      : 
        <div>
        <Module 
          key={null}
          record={
            {'ModuleName':`Example Record UI. ${LoadingMessage}`}
          }

          onIconClick={deleteHandler} 
          onSelectDeleteRecord={() => doSelectModule()} 

          onSelectEditRecord={() => selectEditModule()}

          onUnfavourite={() => removeFavourite()}
          onFavourite={() => addFavourite()}   
          
          recordType = 'Module'
        ></Module>
        </div>
      }
      {modalIsOpen && 
        <Modal 
          onConfirm={() => handleDelete(selectedModuleId)} 
          onClose={closeModalHandler} 
        />
      }
      {modalIsOpen && <Backdrop onBackdrop={closeModalHandler}/>}
      <Form 
        onAddRecord={(module) => handleAdd(module)} 
        onGetNewRecordID={() => getNewModuleID()}
        onCloseEditForm={() => null}
        recordType = 'Module'
      />
      </div>
    </div>
  )

}

export default Modules;