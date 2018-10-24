import { Injectable } from '@angular/core';
import { ApiurlService } from '../service/apiurl.service';
import { AlertService } from './alert.service';
import { HotelDetailsItem } from '../model/hoteldetailsitem';
import { ContextService } from './context.service';

@Injectable()
export class HotelInfoService {

    public m_objHotelInfo: HotelDetailsItem[] = [];
    public m_bIsMaskShow: boolean = false;
    public m_IsEmpty: boolean = false;
    public m_bPriceEmpty: boolean = false;
    public m_sActived: string = 'down';
    public m_sPriceActive: string = 'down';
    public m_sFilterModalState: string = 'close';
    public m_lsChainService: Array<any> = [];
    public m_nPageCount: number;
    public m_lsSelectedIndex: number; // 价格区间选中下标
    public m_nMinPrice: number;
    public m_nMaxPrice: number;

    constructor(
        public apiUrl: ApiurlService,
        private m_objContextService: ContextService,
    ) {}
    
    getHotelInfo(Tag, CityNo, PageNo, PageSize, Arrive, Depart,callback?:any): void{
        this.m_objContextService.loadingCreate();
        this.apiUrl.getHotelInfo(Tag, CityNo, PageNo, PageSize, Arrive, Depart).subscribe(u => {
            this.m_objContextService.loadingClose();
            this.m_nPageCount = u.Data.PageCount;
            this.setHotelInfo(u);
            if(callback) (callback())
        })
    }

    setHotelInfo(data: any){
        data.Data.DataSet.forEach(item => {
            this.m_objHotelInfo.push(item);
        });
        if(this.m_objHotelInfo.length == 0){
            this.m_IsEmpty = true;
        }else{
            this.m_IsEmpty = false;
            let arr: Array<any> = [];
            this.m_objHotelInfo.forEach(item => {
                arr.push(item.Chain.ChainID);
            })
            this.m_objHotelInfo.forEach(ele => {
                this.apiUrl.getHotelComment(ele.Chain.ChainID,0,1,1,0).subscribe(u => {
                    ele.CommentCount = u.Data.RowCount;
                })
            });
        }
        localStorage.setItem('[hotelInfo]', JSON.stringify(data));
    }
    // price-filter模态弹窗价格区间初始值
    initPriceModal(): void {
        this.m_lsSelectedIndex = 0;
    }

    public getChainRoomTypeRemark(arr: Array<any>, hotelId: number, callback?:Function){
        let obj: objChainRoomTypeRemarkCondition = new objChainRoomTypeRemarkCondition;
        obj.roomTypeIDList = arr;
        this.apiUrl.getChainRoomTypeRemark(obj ,hotelId).subscribe(u => {
            localStorage.setItem('ChainRoomTypeRemark', JSON.stringify(u));
            if(callback) callback();
        })
    }
}

class objChainRoomTypeRemarkCondition{
    roomTypeIDList: Array<any>
}
