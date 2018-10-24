import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Platform, AlertController } from 'ionic-angular';
import { ContextService } from '../../service/context.service';
import { ApiurlService } from '../../service/apiurl.service';
import { AlertService } from '../../service/alert.service';
import { ThemeService } from '../../service/theme.service';
import { ErrorEnum } from '../../model/enumclasses';
import { setLocalData, removeSessionData } from '../../util/util';
import { I18NPipe } from '../../pipe/I18NPipe';

@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {
    m_lsFunctionList: boolean[] = [false, false, false, false, false, false, false];
    constructor(
        public m_objNavCtrl: NavController,
        public m_objNavParams: NavParams,
        public m_objContextService: ContextService,
        public m_objApiUrlService: ApiurlService,
        public m_objAlertService: AlertService,
        public m_objThemeService: ThemeService,
        private m_objActionsheetCtrl: ActionSheetController,
        private m_objPlatform: Platform,
        private m_objI18NPipe:I18NPipe,
        private m_objAlertCtrl:AlertController
    ) {
        this.functionList();
    }
    //功能性列表
    functionList(): void {
        let nLength = this.m_lsFunctionList.length;
        for (let i = 0; i < nLength; i++) {
            this.m_lsFunctionList[i] = true;
		}
		//this.m_lsFunctionList[1] = false;
        this.m_lsFunctionList[2] = false;
    }
	//颜色修改
    changeColor(): void {
        var actionSheet = this.m_objActionsheetCtrl.create({
            title: this.m_objI18NPipe.transform('请选择您要切换的主题[请选择您要切换的主题]'),
            buttons: [
                {
                    text: this.m_objI18NPipe.transform("活力橙[橙色]"),
                    handler: () => {
                        this.m_objThemeService.m_objTheme.UserViewStyle = "1";
                        this.changeThemeApi();
                    }
                }, {
                    text: this.m_objI18NPipe.transform("魅惑紫[紫色]"),
                    handler: () => {
                        this.m_objThemeService.m_objTheme.UserViewStyle = "0";
                        this.changeThemeApi();
                    }
                }

            ]
        }).present();
    }
	//语言修改
    changeLanguage(): void {
        var actionSheet = this.m_objActionsheetCtrl.create({
            title: this.m_objI18NPipe.transform('请选择您要切换的语言[请选择您要切换的语言]'),
            buttons: [
                {
                    text: "English",
                    handler: () => {
                        this.m_objContextService.language = 3;
                        this.changeLanguageApi();
                    }
                }, {
                    text: this.m_objI18NPipe.transform("中文[中文]"),
                    handler: () => {
                        this.m_objContextService.language = 4;
                        this.changeLanguageApi();
                    }
                }

            ]
        }).present();
        
        //setTimeout(() => {

        //},500)

	}
	//改变主题颜色
    changeThemeApi(): void {
        this.m_objApiUrlService.setTheme(this.m_objThemeService.m_objTheme).subscribe(data => {
            setLocalData("pq_ThemePlan", this.m_objThemeService.m_objTheme);
            this.m_objContextService.m_bCanBack = false;
            this.m_objNavCtrl.pop();
        });
    }
    //发送改变语言接口
    changeLanguageApi(): void {
        this.m_objApiUrlService.setLanguage(this.m_objContextService.language).subscribe(data => {
            this.m_objContextService.changeLanguage();
            //删除本地语言缓存资源
            for(let i=0;i<10;i++){
                removeSessionData(`languageJSON-${i}`);
            }
            this.m_objAlertCtrl.create({
                title: this.m_objI18NPipe.transform('提示[提示]'),
                message: this.m_objI18NPipe.transform('更换语言需要重启app，点击确定后将退出app[更换语言需要重启app，点击确定后将退出app]'),
                buttons: [
                    {
                        text: this.m_objI18NPipe.transform('确定[确定]'),
                        handler: () => {
                            this.m_objPlatform.exitApp();
                        }
                    }
                ]
            }).present()
        })
    }
  goLegalNotices(): void {
    this.m_objNavCtrl.push("LegalNoticesPage");
  }
  goCopyright(): void {
    this.m_objNavCtrl.push("CopyrightPage");
  }
    //退出登录
    loginOFF(): void {
        this.m_objAlertService.yesNoButtonTipsAlert(this.m_objI18NPipe.transform("您确定要退出登录吗？[您确定要退出登录吗？]"), () => {
            this.m_objContextService.loadingCreate();
            this.m_objApiUrlService.loginOff().subscribe(data => {
                this.m_objContextService.loadingClose();
                if (data.Code == ErrorEnum.successfully) {
                    //清空缓存
                    this.m_objContextService.loginOFF();
                    this.m_objContextService.m_bCanBack = false;
                    this.m_objNavCtrl.pop();
                } else {
                    this.m_objAlertService.tipsAlert(this.m_objI18NPipe.transform("退出登录失败，请重试！[退出登录失败，请重试！]"))
                }
            });
        })
    }
}
