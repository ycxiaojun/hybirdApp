import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { ThemeService } from '../../service/theme.service';
import { AlertService } from '../../service/alert.service';
import { ApiurlService } from '../../service/apiurl.service';
import { AddMebRoomService, UpdateMemberRoomService, QueryMemberRoomServiceResult } from '../../class/MebRoomServiceClass';
import { MebFolioClass } from "../../class/mebFolioClass";
import { EbDict } from "../../class/EBDict";
import { ContextService } from '../../service/context.service';
import { ErrorEnum } from '../../model/enumclasses';
import { I18NPipe } from '../../pipe/I18NPipe';

@IonicPage()
@Component({
  selector: 'page-add-meb-room-service',
  templateUrl: 'add-meb-room-service.html',
})
export class AddMebRoomServicePage {

    m_sPageName: string = '';
    m_objMebFolio: MebFolioClass = new MebFolioClass;
    m_sRoomServiceTypeId: number;
    m_sroomSubServiceTypeId: number;
    m_lsRoomSericeTypeList: Array<EbDict> = [];//服务类型
    m_lsRoomSubRoomServiceTypeList: Array<EbDict> = [];//服务子类
    m_sHandleTime: string;
    m_sRemark: string = '';
    m_objAddRoomServiceCondition: AddMebRoomService = new AddMebRoomService;
    m_nClientUserId: number;
    m_sClientUserName: string;
    m_objRoomServiceInfo: QueryMemberRoomServiceResult = new QueryMemberRoomServiceResult;
    m_nSourceTypeId: number;
    m_objUpdateRoonServiceCondiction:  UpdateMemberRoomService = new UpdateMemberRoomService;
    
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public m_objThemeService: ThemeService,
        public m_objAlertService: AlertService,
        public m_objApiUrl: ApiurlService,
        public m_objApp: App,
        public m_objContextService: ContextService,
        private m_objI18NPipe:I18NPipe
    ) {
        this.m_nClientUserId = this.navParams.get('clientUserId');
        this.m_sClientUserName = this.navParams.get('clientUserName');
        this. m_nSourceTypeId = this.navParams.get('sourceTypeId');
        this.m_sPageName = this.navParams.get('sourceTypeName');
        if (this.m_nSourceTypeId === 0) {
            this.m_objMebFolio = this.navParams.get('mebFolio');
        } else {
            this.m_objRoomServiceInfo = this.navParams.get('roomServiceInfo');
            this.m_sRemark = this.m_objRoomServiceInfo.RoomServiceRemark;
        }
    }

    ionViewDidLoad() {
        this.getRoomServiceType();
        this.m_objContextService.loadingCreate();
    }

    // 获取房间服务类型
    getRoomServiceType (): void {
        this.m_objApiUrl.getEbDict('RoomSericeType').subscribe(u => {
            // 全部选项初始化为未选状态
            u.Data.forEach(ele => {
                ele.selected = false;
            })
            // 设置默认值
            if (this.m_nSourceTypeId == 0) {
                u.Data[0].selected = true;
                this.m_sRoomServiceTypeId = u.Data[0].CodeID;
            } else {
                u.Data.forEach(ele => {
                    if (ele.CodeID == this.m_objRoomServiceInfo.RoomServiceTypeID) {
                        ele.selected = true;
                        this.m_sRoomServiceTypeId = ele.CodeID;
                    }
                })
            }
            this.m_lsRoomSericeTypeList = u.Data;
            this.getSubRoomServiceType();
        })
    } 

    // 获取房间服务子类型
    getSubRoomServiceType (): void {
        // 获取服务子类
        this.m_objApiUrl.getEbDict('SubRoomSericeType').subscribe(u => {
            u.Data.forEach(ele => {
                ele.selected = false;
            })
            if (this.m_nSourceTypeId == 0) {
                u.Data[0].selected = true;
                this.m_sroomSubServiceTypeId = u.Data[0].CodeID;
            } else {
                u.Data.forEach(ele => {
                    if (ele.CodeID == this.m_objRoomServiceInfo.RoomServiceSubTypeID) {
                        ele.selected = true;
                        this.m_sroomSubServiceTypeId = ele.CodeID;
                    }
                })
            }
            this.m_lsRoomSubRoomServiceTypeList = u.Data;
            this.m_objContextService.loadingClose();
        })
    }

    // 选择服务类型
    selectRoomService (index: number, codeId: number): void {
        this.m_lsRoomSericeTypeList.forEach(ele => {
            ele.selected = false;
        })
        this.m_lsRoomSericeTypeList[index].selected = true;
        this.m_sRoomServiceTypeId = codeId;
    }

    // 选择服务子类型
    selectSubRoomService (index: number, codeId: number): void {
        this.m_lsRoomSubRoomServiceTypeList.forEach(ele => {
            ele.selected = false;
        })
        this.m_lsRoomSubRoomServiceTypeList[index].selected = true;
        this.m_sroomSubServiceTypeId = codeId;
    }

    // 增加服务
    addService() {
        if (this.m_sRemark.length < 10) {
            this.m_objAlertService.tipsAlert(this.m_objI18NPipe.transform('描述不得少于10个字[描述不得少于10个字]！'));
        } else {
            this.m_objAddRoomServiceCondition.chainID = this.m_objMebFolio.ChainID;
            this.m_objAddRoomServiceCondition.folioID = this.m_objMebFolio.FolioID;
            this.m_objAddRoomServiceCondition.roomNo = this.m_objMebFolio.RoomNo;
            this.m_objAddRoomServiceCondition.mebID = this.m_objMebFolio.MebID;
            // this.m_objAddRoomServiceCondition.createTime = this.m_sHandleTime;
            this.m_objAddRoomServiceCondition.roomServiceTypeID = this.m_sRoomServiceTypeId;
            this.m_objAddRoomServiceCondition.roomServiceSubTypeID = this.m_sroomSubServiceTypeId;
            this.m_objAddRoomServiceCondition.roomServiceRemark = this.m_sRemark;
            this.m_objAddRoomServiceCondition.serviceStatus = 1;
            this.m_objContextService.loadingCreate();
            this.m_objApiUrl.addMebRoomService(this.m_nClientUserId, this.m_sClientUserName, this.m_objAddRoomServiceCondition).subscribe(u => {
                if (u.Code == ErrorEnum.successfully) {
                    this.m_objContextService.loadingClose();
                    this.m_objAlertService.tipsToast(this.m_objI18NPipe.transform('操作成功[操作成功]！'),'top');
                    this.m_objApp.getRootNav().pop();
                } else {
                    this.m_objAlertService.tipsAlert(u.Msg);
                }
            })
        }
    }

    // 更新服务
    updateService () {
        if (this.m_sRemark.length < 10) {
            this.m_objAlertService.tipsAlert(this.m_objI18NPipe.transform('描述不得少于10个字[描述不得少于10个字]！'));
        } else {
            this.m_objUpdateRoonServiceCondiction.roomServiceTypeID = this.m_sRoomServiceTypeId;
            this.m_objUpdateRoonServiceCondiction.roomServiceSubTypeID = this.m_sroomSubServiceTypeId;
            this.m_objUpdateRoonServiceCondiction.serviceStatus = 1;
            this.m_objUpdateRoonServiceCondiction.roomServiceRemark = this.m_sRemark;
            this.m_objContextService.loadingCreate();
            this.m_objApiUrl.UpdateMemberRoomService(this.m_objRoomServiceInfo.RoomServiceTransID, this.m_nClientUserId, this.m_sClientUserName, this.m_objUpdateRoonServiceCondiction).subscribe(u => {
                if (u.Code == ErrorEnum.successfully) {
                    this.m_objContextService.loadingClose();
                    this.m_objAlertService.tipsToast(this.m_objI18NPipe.transform('操作成功[操作成功]！'),'top');
                    this.m_objApp.getRootNav().pop();
                } else {
                    this.m_objAlertService.tipsAlert(u.Msg);
                }
            })
        }
    }
}
