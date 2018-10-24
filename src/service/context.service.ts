
import { ELanguage, Language } from "../enum/logicerrorenum";
import { Injectable } from "@angular/core";
//import { UserWithRules } from "../centerdataclass/userwithrules";
import { PersonMember } from "../centerdataclass/personmember";
import { setLocalData, getLocalData, removeLocalData, ShowLoading } from "../util/util";
import { ModalController, Platform } from "ionic-angular";
import { CompanyInfo } from "../centerdataclass/companyinfo";
import { ApiurlService } from "./apiurl.service";
import { ERequestSource } from "../enum/enum";
import { ErrorEnum } from "../model/enumclasses";
import { GetFeatures } from "../centerdataclass/getfeatures";
import { AlertService } from "./alert.service";
import { StoreValueSummary } from "../centerdataclass/storevaluesummary";
import { PointGatherInfo } from "../centerdataclass/pointgatherinfo";
//import { Router } from "@angular/router";
//import { getUrlRelativePath } from "../util/util";


@Injectable()
export class ContextService {
    //当前语言
    language: ELanguage = ELanguage.zh;
    m_sIsLogin: boolean = false;

    //是否是微信浏览器
    m_isWeiXin: boolean;

    m_objPersonMember: PersonMember = null;
    m_sPersonMember: string = "m_objPersonMember";

    m_sSearchTag: string = '';
    m_nPayFolioID: number = null;
    //房型详情遮罩
    m_bRoomDetailsMask: boolean = false;

    //是否选用了优惠券
    m_bIsUsedCoupon: boolean = false;

    //优惠券编号数组
    m_lsCouponCode: string[] = [];

    //优惠券抵付金额
    m_nDiscountAmount: number = 0;

    //最大订房数量
    m_nMaxBookNum: number = 5;

    //公司信息
    m_objCompanyInfo: CompanyInfo = new CompanyInfo();
    m_objCompanyMarkdownInfo: any;

    //底部tabs选中页面
    m_nShowTabs: number = 0;

    //功能列表
    m_objFeatures: GetFeatures = new GetFeatures();

    //判断是否IOS微信版
    m_bIsIosWeChat: boolean = false;

    //微信返回按键能否使用
    m_bCanBack: boolean = true;

    //有效优惠券数量
    m_nCouponsNumber: number = 0;

    //七天内快过期优惠券
    m_nEndCoupon: number = 0;

    //储值信息
    m_objStoreValueSummary: StoreValueSummary = new StoreValueSummary();

    //积分信息
    m_objPointGatherInfo: PointGatherInfo = new PointGatherInfo();

    //全局loading动画
    m_objLoading = new ShowLoading();

    //预约看房所选定房型
    m_objRandList: Array<any> = [];

    constructor(
        private m_objModalCtrl: ModalController,
        private m_objApiUrlService: ApiurlService,
        private m_objAlertService: AlertService,
        private m_objPlatform: Platform,
    ) {
        this.ReloadLanguage();
        this.saveState();
        setInterval(() => {
            this.saveState();
        }, 1000)

        this.getCompanyInfo();
        this.getCompanyMarkdownInfo();
        if (!getLocalData("m_objFeatures")) {
            this.getFeatures();
        } else {
            this.m_objFeatures = getLocalData("m_objFeatures");
        }
        this.isWeiXin();
    };
    //格式化年月日（中英文格式不一样）
    FormatDate(years ?: any, months ?: any, days ?: any): string {
        years = Number(years);
        months = Number(months);
        days = Number(days);
        switch (this.language) {
            //中文
            case ELanguage.zh:
                if(years && !months && !days) return years + "年";
                if(years && months && !days) return years + "年" + months + '月';
                if(years && months && days)  return years + "年" + months + '月' + days + '日';
                //只要月日不要年
                if(years==0 && months && days)  return months + '月' + days + '日';
            //英文
            case ELanguage.en:
                let sMonth: string = '';
                switch (months) {
                    case 1:
                        sMonth = 'Jan';
                        break;
                    case 2:
                        sMonth = 'Feb';
                        break;
                    case 3:
                        sMonth = 'Mar';
                        break;
                    case 4:
                        sMonth = 'Apr';
                        break;
                    case 5:
                        sMonth = 'May';
                        break;
                    case 6:
                        sMonth = 'Jun';
                        break;
                    case 7:
                        sMonth = 'Jul';
                        break;
                    case 8:
                        sMonth = 'Aug';
                        break;
                    case 9:
                        sMonth = 'Sep';
                        break;
                    case 10:
                        sMonth = 'Oct';
                        break;
                    case 11:
                        sMonth = 'Nov';
                        break;
                    case 12:
                        sMonth = 'Dec';
                        break;
                }
                //要年不要月日
                if(years && !months && !days) return years.toString();
                //要年月不要日
                if(years && months && !days) return sMonth + ' ' + years ;
                //要年月日
                if(years && months && days)  return sMonth + ' ' + days + ', ' + years;
                //只要月日不要年
                if(years==0 && months && days)  return sMonth + ' ' + days + ', ' + years;
                break;
                
        }
    }
    //加載動畫
    loadingCreate() {
        this.m_objLoading.create();
        this.m_objLoading.bIsShow = true;
    }
    //关闭加载动画
    loadingClose() {
        this.m_objLoading.close();
        this.m_objLoading.bIsShow = false;
    }
    //确认是否微信,true为不是微信
    isWeiXin(): void {
        let agent = navigator.userAgent.toLowerCase();
        if (agent.match(/micromessenger/i) != null) {
            this.m_isWeiXin = false;
            if (this.m_objPlatform.is("ios")) this.m_bIsIosWeChat = true;
        } else {
            this.m_isWeiXin = true;
        }
    }

    //获取城市列表
    getCity(callback?: any): void {
        this.m_objApiUrlService.getCityList().subscribe(data => {
            if (data.Code == 0) {
                localStorage["[cityList]"] = JSON.stringify(data);
                if (callback) callback();
            } else {
                this.m_objAlertService.tipsAlert(data.Msg);
            }
        })
    }

    //获取功能列表
    getFeatures(): void {
        this.m_objApiUrlService.getFeatures().subscribe(data => {
            if (data.Code == ErrorEnum.successfully) {
                setLocalData("m_objFeatures", data.Data);
                this.m_objFeatures = data.Data;
            }
        })
    }

    //获取公司信息
    getCompanyInfo(): void {
        this.m_objApiUrlService.getCompanyInfo(ERequestSource.Mobile).subscribe(data => {
            if (data.Code == ErrorEnum.successfully) {
                setLocalData("pq_CompanyInfo", data.Data);
                this.m_objCompanyInfo = data.Data;
            }
        })
    }
    //获取公司标记信息
    getCompanyMarkdownInfo(): void {
        this.m_objApiUrlService.getCompanyMarkdownInfo(ERequestSource.PC).subscribe(data => {
            if (data.Code == ErrorEnum.successfully) {
                setLocalData("pq_CompanyMarkdownInfo", data.Data);
                this.m_objCompanyMarkdownInfo = data.Data;
            }
        })
    }
    //改變當前語言
    changeLanguage(): void {
        sessionStorage["language"] = JSON.stringify(this.language);
        location.href = location.href.toString();
        //window.location.reload();
    }
    ReloadLanguage(): void {
        if (sessionStorage["language"]) {
            this.language = JSON.parse(sessionStorage["language"]);
        }
    }
    saveState(): void {
        if (this.m_objPersonMember)
            setLocalData(this.m_sPersonMember, this.m_objPersonMember);
    }
    getLanguage(): ELanguage {
        if (sessionStorage["language"]) return JSON.parse(sessionStorage["language"]);
        return this.language;
    }
    //获取当前用户登入信息
    currentUser(): PersonMember {
        return this.m_objPersonMember;
    }
    setCurrentUser(objPersonMember: PersonMember): void {
        this.m_objPersonMember = objPersonMember;
    }
    isLogin(): boolean {
        if (!this.m_objPersonMember && getLocalData(this.m_sPersonMember))
            this.m_objPersonMember = getLocalData(this.m_sPersonMember);
        return this.m_objPersonMember != null;
    }
    loginOFF(): void {
        this.m_objPersonMember = null;
        removeLocalData(this.m_sPersonMember);
    }
    loginCheck(): boolean {
        if (this.isLogin()) return true;
        // 未登录则跳转到登陆页面
        let modal = this.m_objModalCtrl.create("LoginPage").present;
        return false;
    }
}
