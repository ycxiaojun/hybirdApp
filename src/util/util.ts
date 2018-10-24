//验证手机号是否有效
export function verificationMobile(sMobile:string): boolean {
    var reg = /^(1[3-9][0-9])\d{8}$/;
    return reg.test(sMobile); 
}

//设置或跟新本地存储数据
export function setLocalData(sDataName:string, objData:any):void{
    if (sDataName != "") {
        if (objData) {
            var dataJson = JSON.stringify(objData);
            window.localStorage.setItem(sDataName, dataJson);
        }
    }
}
//获取本地存储数据
export function getLocalData(sDataName: string): any {
    if (sDataName != "") return JSON.parse(window.localStorage.getItem(sDataName));
}
//删除本地存储数据
export function removeLocalData(sDataName: string): void {
    if (sDataName != "") window.localStorage.removeItem(sDataName);
}


//设置或跟新本地存储数据
export function setSessionData(sDataName: string, objData: any,fn?:any): void {
    if (sDataName != "") {
        if (objData) {
            var dataJson = JSON.stringify(objData);
            window.sessionStorage.setItem(sDataName, dataJson);
            if (fn) fn();
        }
    }
}
//获取本地存储数据
export function getSessionData(sDataName: string): any {
    if (sDataName != "") return JSON.parse(window.sessionStorage.getItem(sDataName));
}
//删除本地存储数据
export function removeSessionData(sDataName: string): void {
    if (sDataName != "") window.sessionStorage.removeItem(sDataName);
}

//格式化星期
export function formatWeek(weekCode: number): any{
    let lsI18N: any[] = [];
    //终止循环
    let bEnd:boolean;
    let objI18NText:any = {
        Mon:'',
        Tue:'',
        Wed:'',
        Thu:'',
        Fri:'',
        Sat:'',
        Sun:'',
    }
    if(getSessionData("languageJSON-3")) {
        lsI18N = getSessionData("languageJSON-3");
        bEnd = true;
        let nLen = lsI18N.length;
        for(let i=0;i<nLen;i++){
            if(lsI18N[i].key == '周一'){
                objI18NText.Mon = lsI18N[i].value;
                continue;
            }else if(lsI18N[i].key == '周二'){
                objI18NText.Tue = lsI18N[i].value;
                continue;
            }else if(lsI18N[i].key == '周三'){
                objI18NText.Wed = lsI18N[i].value;
                continue;
            }else if(lsI18N[i].key == '周四'){
                objI18NText.Thu = lsI18N[i].value;
                continue;
            }else if(lsI18N[i].Fri == '周五'){
                objI18NText.Fri = lsI18N[i].value;
                continue;
            }else if(lsI18N[i].key == '周六'){
                objI18NText.Sat = lsI18N[i].value;
                continue;
            }else if(lsI18N[i].key == '周日'){
                objI18NText.Sun = lsI18N[i].value;
            }
            for(let list in objI18NText){
                if(objI18NText[list] == '') {
                    bEnd = false;
                    break;
                }
            }
            //如果都匹配完毕则退出循环
            if(bEnd) break;
        }
    }else if(getSessionData("languageJSON-4") || getSessionData("languageJSON-2")){
        objI18NText.Mon = '周一';
        objI18NText.Tue = '周二';
        objI18NText.Wed = '周三';
        objI18NText.Thu = '周四';
        objI18NText.Fri = '周五';
        objI18NText.Sat = '周六';
        objI18NText.Sun = '周日';
    }
    let week: string;
    switch(weekCode)
    {
        case 0:
            week = objI18NText.Mon;
            break;
        case 1:
            week = objI18NText.Tue;
            break;
        case 2:
            week = objI18NText.Wed;
            break;
        case 3:
            week = objI18NText.Thu;
            break;
        case 4:
            week = objI18NText.Fri;
            break;
        case 5:
            week = objI18NText.Sat;
            break;
        case 6:
            week = objI18NText.Sun;
            break;
    }
    return week;
}
//初始化谷歌地图 需要引用脚本 <script src="http://maps.googleapis.com/maps/api/js?key=AIzaSyBzE9xAESye6Kde-3hT-6B90nfwUkcS8Yw&sensor=false">
declare var google: any;
export function initGoogleMap(sElementID: string, nLongitude: number, nLatitude: number, sTitle: string) {
	try {
		var objLatLng = { lat: nLatitude, lng: nLongitude };

		// Create a map object and specify the DOM element
		// for display.
		var map = new google.maps.Map(document.getElementById(sElementID), {
			center: objLatLng,
			zoom: 16
		});

		// Create a marker and set its position.
		var marker = new google.maps.Marker({
			map: map,
			position: objLatLng,
			title: sTitle
		});
	} catch{

	}
}

export function fileToBase64(objFile: any, objComponent: any, objCallbackFn: Function): void {
    var reader = new FileReader();
    //var nAllowImgFileSize = 2100000; //上传图片最大值(单位字节)（ 2 M = 2097152 B ）超过2M上传失败
    var imgUrlBase64;
    if (objFile) {
        //将文件以Data URL形式读入页面  

        imgUrlBase64 = reader.readAsDataURL(objFile);
        reader.onload = function (e) {
            //	var sBase64 = reader.result.toString();
            var sBase64 = reader.result.toString().substring(reader.result.toString().indexOf(",") + 1);
            objCallbackFn.call(objComponent, (sBase64));
        }
    }

}

//获取今天的日期
export function getToday() {
    let objToday = new Date();
    let nYear = objToday.getFullYear();
    let nMonth = objToday.getMonth() + 1;
    let nDate = objToday.getDate();
    return {
        year: nYear,
        month: nMonth,
        day: nDate
    }
}

//计算两个时间相差天数
export function dateDifference(sDate1,sDate2): number {
	let dateSpan, tempDate, nDays: number;
	sDate1 = Date.parse(sDate1);  //返回当前时间的毫秒数
	sDate2 = Date.parse(sDate2);
	dateSpan = sDate2 - sDate1;
	dateSpan = Math.abs(dateSpan); //返回绝对值
	nDays = Math.floor(dateSpan / (24 * 3600 * 1000)); //向下取整
	return nDays;
}

//loading弹窗
export function ShowLoading() {
    this.objBox = null;
    this.objMark = null;
    this.bIsShow = false;
    //配置参数
    this.setting = {
        content: '',
        mark:false
    }
}

let m_objShowIng = null;
let m_nOpacity = 0;
ShowLoading.prototype.init = (opt)=>{
    // console.log(this.setting);
    // extend(this.setting, opt);
    this.create();
    this.close();
    if(this.setting.mark){
        this.mark;
    }
}

//动态创建加载动画
ShowLoading.prototype.create = ()=>{
    this.objBox = document.createElement("div");
    this.objBox.className = 'pq-loading';
    this.objBox.style.opacity = 0;
    this.objBox.innerHTML = `
        <div class="pq-mark"></div>
            <div class="pq-load">
                <div class="pq-load-style"></div>
            </div>
        </div>
    `;

    document.getElementById("ion-nav").appendChild(this.objBox);
    m_objShowIng = setInterval(()=>{
        m_nOpacity += 0.04;
        this.objBox.style.opacity = m_nOpacity;
        if(m_nOpacity >= 1) clearInterval(m_objShowIng);
    },10)
}
//全局遮罩
ShowLoading.prototype.mark = ()=>{
    this.objMark = document.createElement('div');
    this.objMark.className = "pq-mark";
    document.getElementById("ion-nav").appendChild(this.objMark);
}
//关闭窗口
ShowLoading.prototype.close = ()=>{
    if(m_nOpacity < 1) clearInterval(m_objShowIng);
    let time = setInterval(()=>{
        m_nOpacity -= 0.04;
        this.objBox.style.opacity = m_nOpacity;
        if(m_nOpacity <= 0) {
            clearInterval(time);
            document.getElementById("ion-nav").removeChild(this.objBox);
        }
    },10)
    //if(this.setting.mark) document.body.removeChild(this.objMark);
}
//拷贝
function extend(obj1,obj2){
    for(var i in obj2){
        obj1[i] = obj2[i];
    }
}