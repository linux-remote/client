const map = {
    sys_app_fs: {
      name: "FS Manager",
      iconUrl: 'tango/user-home.png',
      // unique: false,
      // window: {
      //   width: ,
      //   height: ,
      // }
    },
    sys_app_recycle_bin : {
      name: "Recycle Bin",
      iconUrl: 'tango/user-trash.png',
      unique: true,
      isEmpty: true,
      ctx: ['empty']
    },
    sys_app_editor: {
      name: "Notepad",
      handleFileCategory: 'text',
      iconUrl: 'nuvola/accessories-text-editor-6.png'
    },
    sys_app_image_viewer: {
      name: "Image Viewer",
      handleFileCategory: 'image',
      iconUrl: 'tango/image-x-generic.png'
    },
    sys_app_terminal: {
      name: "Terminal",
      iconUrl: 'nuvola/utilities-terminal-6.png',
      window: {
        width: 742,
        height: 440
      }
    }
}

const DEF_TASK_WIDTH = 800;
const DEF_TASK_HEIGHT = 600;

function _init(appId, app){
  app.id = appId;
  app.window = app.window || Object.create(null);
  const appWindow =  app.window;
  appWindow.title = app.name;
  // init width
  if(typeof appWindow.width !== 'number'){
    appWindow.startWidth = DEF_TASK_WIDTH;
  } else {
    appWindow.startWidth = appWindow.width;
    delete(appWindow.width);
  }

  // init height
  if(typeof appWindow.height !== 'number'){
    appWindow.startHeight = DEF_TASK_HEIGHT;
  } else {
    appWindow.startHeight = appWindow.height;
    delete(appWindow.height);
  }
}


export const handleFileAppMap = Object.create(null);
handleFileAppMap[''] = [];

Object.keys(map).forEach(k => {
  const app = map[k];
  _init(k, app);
  if(app.handleFileCategory){
    handleFileAppMap[''].push(app);
    let categoryArr = handleFileAppMap[app.handleFileCategory];
    if(!categoryArr){
      categoryArr = handleFileAppMap[app.handleFileCategory] = [];
    }
    categoryArr.push(app);
  }
});

export function getApp(appId){
  return map[appId];
}

export default map;