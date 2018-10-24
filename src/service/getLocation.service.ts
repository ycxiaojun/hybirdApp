import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { getSessionData } from '../util/util';

declare var BMap;
declare var BMAP_STATUS_SUCCESS;

@Injectable()
export class GetLocationService {
    m_bEnd:boolean;
    m_lsI18N = [];
    m_objI18NText:any = {
        all:'',
        local:'',
        none:''
    }
    m_sCurrentCity:string = "";
    m_sSelectedCity:string = this.m_objI18NText.all;
    m_nCityNo:number = 0;

    constructor(
        private toastCtrl: ToastController,
    ) {
        if(getSessionData("languageJSON-3")) {
            this.m_lsI18N = getSessionData("languageJSON-3");
            this.m_bEnd = true;
            let nLen = this.m_lsI18N.length;
            for(let i=0;i<nLen;i++){
                if(this.m_lsI18N[i].key == '全部'){
                    this.m_objI18NText.all = this.m_lsI18N[i].value;
                    continue;
                }else if(this.m_lsI18N[i].key == '您所在的城市'){
                    this.m_objI18NText.local = this.m_lsI18N[i].value;
                    continue;
                }else if(this.m_lsI18N[i].key == '暂时还没有我们的酒店，请打开城市列表，选择您要预定本酒店的城市'){
                    this.m_objI18NText.none = this.m_lsI18N[i].value;
                }
                for(let list in this.m_objI18NText){
                    if(this.m_objI18NText[list] == '') {
                        this.m_bEnd = false;
                        break;
                    }
                }
                //如果都匹配完毕则退出循环
                if(this.m_bEnd) break;
            }
        }else if(getSessionData("languageJSON-2")){
            this.m_objI18NText.all = '全部';
            this.m_objI18NText.local = '您所在的城市';
            this.m_objI18NText.none = '暂时还没有我们的酒店，请打开城市列表，选择您要预定本酒店的城市';
        }

    }
    
	public getLocationCity(el: string, callback?: any) {
        let self = this;
        let map = new BMap.Map(el);
		let point = new BMap.Point(116.331398,39.897445);
		map.centerAndZoom(point,12);
        let geolocation = new BMap.Geolocation();
		geolocation.getCurrentPosition(function (r) {
			if(this.getStatus() == BMAP_STATUS_SUCCESS){
				var mk = new BMap.Marker(r.point);
				map.addOverlay(mk);
                map.panTo(r.point);
				self.currentLocationCity(r.address.city);
                if (callback) {
                    callback();
                };
			};
        });
    }

    public currentLocationCity(cityName:string){
        this.m_sCurrentCity = cityName;
        this.m_sSelectedCity = cityName;
        this.bindCityId(cityName);
    }

    public selectedCity(name:string){
        this.m_sSelectedCity = name;
    }

    private bindCityId(cityName:string){
        let cityData = JSON.parse(localStorage["[cityList]"]).Data;
        let flag = false;
        for(let i = 0; i < cityData.length; i++){
            if(cityData[i].objCity.CityName == cityName){
                this.m_nCityNo = cityData[i].objCity.CityID;
                flag = true;
            }
        }
        if(!flag){
            this.m_nCityNo = 0;
            let msg = this.m_objI18NText.local + cityName +  this.m_objI18NText.none +'！';
            let toast = this.toastCtrl.create({
                message: msg,
                duration: 3000,
                position: 'middle'
            });
            toast.present();
        }
    }
}
