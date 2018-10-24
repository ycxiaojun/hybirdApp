import { Injectable } from '@angular/core';
import { AlertController, ToastController, LoadingController } from "ionic-angular";
import { getSessionData } from '../util/util';
//import { I18NPipe } from '../pipe/I18NPipe';

@Injectable()
export class AlertService {
    m_lsI18N: any[] = [];
    //终止循环
    m_bEnd:boolean;
    m_objI18NText:any = {
        tips:'',
        enter:'',
        cancel:''
    }
    constructor(
        private m_objAlertCtrl: AlertController,
        private m_objToastCtrl: ToastController,
        private m_objLoadingCtrl: LoadingController
        //private m_objI18NPipe:I18NPipe
    ) {
        if(getSessionData('languageJSON-3')) {
            this.m_lsI18N = getSessionData("languageJSON-3");
            if(this.m_lsI18N){
                this.m_bEnd = true;
                let nLen = this.m_lsI18N.length;
                for(let i=0;i<nLen;i++){
                    if(this.m_lsI18N[i].key == '提示'){
                        this.m_objI18NText.tips = this.m_lsI18N[i].value;
                        continue;
                    }else if(this.m_lsI18N[i].key == '确定'){
                        this.m_objI18NText.enter = this.m_lsI18N[i].value;
                        continue;
                    }else if(this.m_lsI18N[i].key == '取消'){
                        this.m_objI18NText.cancel = this.m_lsI18N[i].value;
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
            }
        }else if(getSessionData("languageJSON-4")){
            this.m_objI18NText.tips = '提示';
            this.m_objI18NText.enter = '确定';
            this.m_objI18NText.cancel = '取消';
        }
    }

    //提示框
    tipsAlert(message: any, fn?: any): void {
        let tips = this.m_objAlertCtrl.create({
            title: this.m_objI18NText.tips,
            message: message,
            buttons: [
                {
                    text: this.m_objI18NText.enter,
                    handler: () => {
                        if (fn) fn();
                    }
                }
            ]
        }).present()
    }
 
    //多按钮提示框
    yesNoButtonTipsAlert(message: string, callback: any,callbackFn?:any): void {
        let tips = this.m_objAlertCtrl.create({
            title: this.m_objI18NText.tips,
            message: message,
            buttons: [
                {
                    text: this.m_objI18NText.cancel,
                    handler: () => {
                        if (callbackFn)callbackFn();
                    }
                }, {
                    text: this.m_objI18NText.enter,
                    handler: () => {
                        callback();
                    }
                }
            ]
        }).present()
    }

    //会自动消失的提示框
    tipsToast(message: string, position: string, duration?: number): void {
        let toast = this.m_objToastCtrl.create({
            message: message,
            duration: duration ? duration : 2000,
            position: position
        }).present();
    }

	//加载
    loading(message?: string,duration?:number): any {
        let loader = this.m_objLoadingCtrl.create({
            content: message ? message:"",
            duration: duration ? duration : null
        });
        loader.present();
        return loader;
    }
}
