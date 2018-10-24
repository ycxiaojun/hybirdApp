import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController } from 'ionic-angular';
import { QueryMemberRoomServiceResult } from '../../class/MebRoomServiceClass';
import { EbDict } from "../../class/EBDict";
import { I18NPipe } from '../../pipe/I18NPipe';
import { ApiurlService } from '../../service/apiurl.service';
import { ErrorEnum } from '../../model/enumclasses';
import { ContextService } from '../../service/context.service';
import { AlertService } from '../../service/alert.service';

@IonicPage()
@Component({
    selector: 'page-member-service-details',
    templateUrl: 'member-service-details.html',
})
export class MemberServiceDetailsPage {

    public m_objRoomServiceInfo: QueryMemberRoomServiceResult;
    public m_nClientUserId: number;
    public m_sClientUserName: string;
    public m_lsRoomServiceStatusList: Array<string> = ['待安排', '已安排', '完成', '取消'];
    public m_lsRoomSericeTypeList: Array<EbDict> = [];//服务类型
    public m_lsRoomSubRoomServiceTypeList: Array<EbDict> = [];//服务子类
    

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public m_objApp: App,
        public m_objI18NPipe: I18NPipe,
        public m_objAlertCtrl: AlertController,
        public m_objApiUrlService: ApiurlService,
        public m_objContextService: ContextService,
        public m_objAlertService: AlertService,
    ) {
        this.m_objRoomServiceInfo = this.navParams.get('roomServiceInfo');
        this.m_nClientUserId = this.navParams.get('clientUserId');
        this.m_sClientUserName = this.navParams.get('clientUserName');
    }

    ionViewDidLoad() {
        
    }

    //前往更新房间服务页面
    toUpdateRoomService (): void {
        this.m_objApp.getRootNav().push('AddMebRoomServicePage',{
            roomServiceInfo: this.m_objRoomServiceInfo,
            clientUserId: this.m_nClientUserId,
            clientUserName: this.m_sClientUserName,
            sourceTypeId: 1,
            sourceTypeName: this.m_objI18NPipe.transform('更新房间服务[更新房间服务]') 
        });
    }

    // 取消房间服务
    cancelRoomService (): void {
        const prompt = this.m_objAlertCtrl.create({
            title: this.m_objI18NPipe.transform('请输入取消原因[请输入取消原因]'),
            inputs: [
                {
                    name: 'remark',
                    placeholder: this.m_objI18NPipe.transform('请输入取消原因[请输入取消原因]')
                },
            ],
            buttons: [
                {
                    text: this.m_objI18NPipe.transform('取消[取消]'),
                    handler: data => {
                    }
                },
                {
                    text: this.m_objI18NPipe.transform('确定[确定]'),
                    handler: data => {
                        this.m_objApiUrlService.CancelMemberRoomService(this.m_objRoomServiceInfo.RoomServiceTransID, data.remark, this.m_nClientUserId, this.m_sClientUserName).subscribe(u => {
                            if (u.Code == ErrorEnum.successfully) {
                                this.m_objContextService.loadingClose();
                                this.m_objAlertService.tipsToast(this.m_objI18NPipe.transform('操作成功！[操作成功]'),'top');
                            } else {
                                this.m_objAlertService.tipsAlert(u.Msg);
                            }
                        })
                    }
                }
            ]
        }).present();
    }

}
