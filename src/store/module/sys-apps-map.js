const map = {
    sys_app_fs: {
      name: "FS Manager",
      iconUrl: 'nuvola/system-file-manager-5.png',
      window: {
        width: 730,
        height: 610
      }
      // unique: false,
    },
    sys_app_editor: {
      name: "Notepad",
      handleFileCategory: 'text',
      iconUrl: 'nuvola/accessories-text-editor-6.png',
      window: {
        autoFocus: false,
        top: 0.6,
        left: 0.6
      }
    },
    sys_app_terminal: {
      name: "Terminal",
      iconUrl: 'nuvola/utilities-terminal-6.png',
      notFollowWH: true,
      window: {
        top: 100,
        left: 100,
        width: 742,
        height: 440
      }
    },
    sys_app_users: {
      name: "Users Manager",
      hidden: true,
      iconUrl: 'nuvola/Nuvola_apps_kdmconfig.png',
      window: {
        autoFocus: false
      }
    },
    sys_app_image_viewer: {
      name: "Image Viewer",
      handleFileCategory: 'image',
      iconUrl: 'nuvola/image-x-generic.png',
      hidden: true,
      window: {
        top: 0,
        left: 0
      }
    },

    sys_app_recycle_bin : {
      name: "Recycle Bin",
      iconUrl: 'nuvola/user-trash.png',
      unique: true,
      isEmpty: true,
      ctx: 'Empty Recycle Bin'
    },
}

const DEF_TASK_WIDTH = 600;
const DEF_TASK_HEIGHT = 480;

function def(obj, k, v){
  if(obj[k] === undefined){
    obj[k] = v;
  }
}
function _init(appId, app){
  app.id = appId;
  if(!app.window){
    app.window =  Object.create(null);
  }
  
  const appWindow = app.window;
  // init width
  def(appWindow, 'width', DEF_TASK_WIDTH);
  def(appWindow, 'height', DEF_TASK_HEIGHT);
  def(appWindow, 'movable', true);
  def(appWindow, 'resizable', true);
  def(appWindow, 'maximizable', true);
  def(appWindow, 'minimizable', true);
  // def(appWindow, 'autoFocus', true);
  // appWindow.title = app.name;
  // if(typeof appWindow.width !== 'number'){
  //   appWindow.width = DEF_TASK_WIDTH;
  // }
  // // init height
  // if(typeof appWindow.height !== 'number'){
  //   appWindow.height = DEF_TASK_HEIGHT;
  // }
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