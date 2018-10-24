import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, App, AlertController } from 'ionic-angular';
import { trigger, transition, state, style, animate } from '@angular/animations';
import { ApiurlService } from '../../service/apiurl.service';
import { ErrorEnum } from '../../model/enumclasses';
import { AlertService } from '../../service/alert.service';
import { ContextService } from '../../service/context.service';
import { QueryMemberRoomServiceResult } from '../../class/MebRoomServiceClass';
import { EbDict } from "../../class/EBDict";
import { MebFolioClass } from "../../class/mebFolioClass";
import { MebFolio } from "../../class/mebFolio";
import { ThemeService } from '../../service/theme.service';
import { MyDateService } from '../../service/myDate.service';
import { I18NPipe } from '../../pipe/I18NPipe';

@IonicPage()
@Component({
    selector: 'page-member-service',
    templateUrl: 'member-service.html',
    animations: [
        trigger('tabToggle',[
            state('close', style({
                'color': '#808080',
                'font-weight': '300',
            })),
            state('open', style({
                'color': '#000',
                'font-weight': '600',
            })),
            transition('close => open',animate(16)),
            transition('open => close',animate(16))
        ])
    ]
})
export class MemberServicePage {
    public m_nFolioState: Array<number> =  [4]; // 入住
    public m_nPageSize: number = 20;
    public m_nPageNo: number = 1;
    public m_bHasCheckInOrders: boolean = true; // 是否存在入住单
    public m_nMebId: number; //用户ID
    public m_sMebName: string; //用户名
    public m_objMebFolio: MebFolioClass = new MebFolioClass; //房单信息
    public m_lsMebFolioList: Array<MebFolioClass> = []; // 用户放单列表
    public m_nCurrentMebFolioIndex: number = 0; // 当前显示的用户放单下标
    public m_bCanPrev: boolean = false; //是否显示上一张切换按钮
    public m_bCanNext: boolean = false; //是否显示下一张切换按钮
    public m_lsRoomServiceStateList = [ //房间服务列表
        {name: this.m_objI18NPipe.transform('待安排[待安排]'), isSelected: false, animateState: 'close', emptyMsg: this.m_objI18NPipe.transform('暂无待安排的服务[暂无待安排的服务]...'), data: Array<QueryMemberRoomServiceResult>()},
        {name: this.m_objI18NPipe.transform('已安排[已安排]'), isSelected: false, animateState: 'close', emptyMsg: this.m_objI18NPipe.transform('暂无已安排的服务[暂无已安排的服务]...'), data: Array<QueryMemberRoomServiceResult>()},
        {name: this.m_objI18NPipe.transform('完成[完成]'), isSelected: false, animateState: 'close', emptyMsg: this.m_objI18NPipe.transform('暂无完成的服务[暂无完成的服务]...'), data: Array<QueryMemberRoomServiceResult>()},
        {name: this.m_objI18NPipe.transform('取消[取消]'), isSelected: false, animateState: 'close', emptyMsg: this.m_objI18NPipe.transform('暂无取消的服务[暂无取消的服务]...'), data: Array<QueryMemberRoomServiceResult>()}
    ];
    public m_nShowRoomServiceIndex: number = 0; //当前显示的房间服务类型的下标
    public m_lsRoomSericeTypeList: Array<EbDict> = [];//服务类型
    public m_lsRoomSubRoomServiceTypeList: Array<EbDict> = [];//服务子类

    constructor(
        public m_objNavCtrl: NavController,
        public m_objApiUrlService: ApiurlService,
        public m_objAlertService: AlertService,
        public m_objContextService: ContextService,
        public m_objModalCtrl: ModalController,
        public m_objApp: App,
        public m_objThemeService: ThemeService,
        public m_objMyDateService: MyDateService,
        public m_objAlertCtrl: AlertController,
        private m_objI18NPipe:I18NPipe
    ) { 
    }

    ionViewDidLoad () {
        this.m_objContextService.loadingCreate();
        this.getMebInfo();
    }

    // 获取当前登录用户信息
    getMebInfo () {
        let mebInfo = JSON.parse(localStorage.getItem('m_objPersonMember'));
        this.m_nMebId = mebInfo.MebID;
        this.m_sMebName = mebInfo.MebName;
        this.queryMebFolio();
        this.getRoomServiceType();
    }

    // 获取用户房单列表
    queryMebFolio (): void {
        let queryMebFolioCondition: MebFolio = new MebFolio;
        queryMebFolioCondition.MebID = this.m_nMebId;
        queryMebFolioCondition.FolioState = this.m_nFolioState;
        this.m_objApiUrlService.queryMebFolio(this.m_nPageSize, this.m_nPageNo, queryMebFolioCondition).subscribe(data => {
            //数据获取成功
			if (data.Code == ErrorEnum.successfully) {
                // 总数为0
                if (data.Data.RowCount = 0) {
                    this.m_bHasCheckInOrders = false;
                } else {
                    this.m_bHasCheckInOrders = true;
                    this.m_lsMebFolioList = data.Data.DataSet;
                    this.setCurrentFolio();
                    this.isCanClick();
                    if (data.Data.RowCount > this.m_nPageSize) {
                        this.m_nPageNo += 1;
                        this.queryMebFolio();
                    }
                }
            } else {
                this.m_objAlertService.tipsAlert(data.Msg);
            }
        })
    }

    // 设置当前显示的房单
    setCurrentFolio (): void {
        this.m_objMebFolio = this.m_lsMebFolioList[this.m_nCurrentMebFolioIndex];
    }

    // 切换上一个房单
    prevMebFolio (): void {
        this.m_nCurrentMebFolioIndex -= 1;
        this.setCurrentFolio();
        this.isCanClick();
    }

    // 切换至下一个房单
    nextMebFolio (): void {
        this.m_nCurrentMebFolioIndex += 1;
        this.setCurrentFolio();
        this.isCanClick();
    }

    // 是否可点击
    isCanClick (): void {
        if (this.m_nCurrentMebFolioIndex == 0) {
            this.m_bCanPrev = false;
            if (this.m_lsMebFolioList.length == 1) {
                this.m_bCanNext = false;
            } else {
                this.m_bCanNext = true;
            }
        } else  {
            this.m_bCanPrev = true;
            if (this.m_nCurrentMebFolioIndex + 1 < this.m_lsMebFolioList.length) {
                this.m_bCanNext = true;
            } else {
                this.m_bCanNext = false;
            }
        }
    }

    // 获取服务类型
    getRoomServiceType (): void {    
        this.m_objApiUrlService.getEbDict('RoomSericeType').subscribe(u => {
            this.m_lsRoomSericeTypeList = u.Data;
            this.getSubRoomServiceType();
        })
    } 

    // 获取服务子类
    getSubRoomServiceType (): void {
        this.m_objApiUrlService.getEbDict('SubRoomSericeType').subscribe(u => {
            this.m_lsRoomSubRoomServiceTypeList = u.Data;
            this.getMemberRoomServiceList();
        })
    }

    // 前往增加房间服务页面
    toAddMebRoomServicePage() {
        this.m_objApp.getRootNav().push('AddMebRoomServicePage',{
            mebFolio: this.m_objMebFolio,
            clientUserId: this.m_nMebId,
            clientUserName: this.m_sMebName,
            sourceTypeId: 0,
            sourceTypeName: this.m_objI18NPipe.transform('新增房间服务[新增房间服务]') 
        });
    }

    // 前往服务详情页
    toMebRoonServiceDetailsPage (roomServiceInfo: QueryMemberRoomServiceResult): void {
        this.m_objApp.getRootNav().push('MemberServiceDetailsPage', {
            roomServiceInfo: roomServiceInfo,
            clientUserId: this.m_nMebId,
            clientUserName: this.m_sMebName,
        });
    }
    // tab切换
    tabToggle (index: number): void {
        this.m_lsRoomServiceStateList.forEach(ele => {
            ele.animateState = 'close';
            ele.isSelected = false;
        })
        this.m_lsRoomServiceStateList[index].animateState = 'open';
        this.m_lsRoomServiceStateList[index].isSelected = true;
        this.m_nShowRoomServiceIndex = index;
    }

    // 获取用户房间服务列表
    getMemberRoomServiceList (): void {
        let stateList = [1,2,3,4]; //1:待安排, 2:已安排， 3：完成，  4：取消
        this.m_nShowRoomServiceIndex = 0;
        this.m_lsRoomServiceStateList[0].isSelected = true;
        this.m_lsRoomServiceStateList[0].animateState = 'open';
        stateList.forEach(ele => {
            this.m_objApiUrlService.GetMemberRoomServiceList(this.m_nMebId,ele).subscribe(u => {
                this.m_lsRoomServiceStateList[ele-1].data = u.Data;
                u.Data.forEach(item => {
                    item.CreateTime = item.CreateTime.replace('T',' ').split('.')[0];
                    this.m_lsRoomSericeTypeList.forEach(a => {
                        if (item.RoomServiceTypeID = a.CodeID) {
                            item.RoomServiceTypeName = a.CodeName;
                        }
                    })
                    this.m_lsRoomSubRoomServiceTypeList.forEach(b => {
                        if (item.RoomServiceSubTypeID = b.CodeID) {
                            item.RoomServiceSubTypeName = b.CodeName;
                        }
                    })
                })
            })
        })
        this.m_objContextService.loadingClose();
    }

    //前往更新房间服务页面
    toUpdateRoomService (roomServiceInfo: QueryMemberRoomServiceResult): void {
        event.stopPropagation();
        this.m_objApp.getRootNav().push('AddMebRoomServicePage',{
            roomServiceInfo: roomServiceInfo,
            clientUserId: this.m_nMebId,
            clientUserName: this.m_sMebName,
            sourceTypeId: 1,
            sourceTypeName: this.m_objI18NPipe.transform('更新房间服务[更新房间服务]') 
        });
    }

    // 取消房间服务
    cancelRoomService (roomServiceInfo: QueryMemberRoomServiceResult): void {
        event.stopPropagation();
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
                        this.m_objApiUrlService.CancelMemberRoomService(roomServiceInfo.RoomServiceTransID, data.remark, this.m_nMebId, this.m_sMebName).subscribe(u => {
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