import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GetLocationService } from '../../service/getLocation.service';
import { ContextService } from '../../service/context.service';
import { MyDateService } from '../../service/myDate.service';
import { AlertService } from '../../service/alert.service';
import { ThemeService } from '../../service/theme.service';

@Component({
    selector: 'my-hotelfilter',
    templateUrl: 'my-hotelfilter.html'
})
export class MyHotelfilterComponent {
    m_lsFunction: Array<boolean> = [false, false];
    m_bRent:boolean = false;
    constructor(
		private m_objNavCtrl: NavController,
		private m_objGetLocationService: GetLocationService,
		private m_objContextService: ContextService,
		private m_objMyDateService: MyDateService,
		private m_objAlertService: AlertService,
        private m_objThemeService: ThemeService,
    ) {}

    // 城市选择页面
    goCityPicker() :void{
        this.m_objNavCtrl.push('CityPickerPage');
    }

    // 日期选择页面
    goDatePicker() :void{
        this.m_objNavCtrl.push('DatePickerPage');
    }

    // 获取定位
    getLocation(): void{
        this.m_objContextService.loadingCreate();
        if (localStorage.getItem("[cityList]")) {
            this.m_objGetLocationService.getLocationCity('baiduLocation', () => {
                this.m_objContextService.loadingClose();
            });
        } else {
            this.m_objContextService.getCity(() => {
                this.m_objGetLocationService.getLocationCity('baiduLocation', () => {
                    this.m_objContextService.loadingClose();
                });
            });
        }
    }

    getLocationCity (): void {

    }

    onKey(event: any): void{
        this.m_objContextService.m_sSearchTag = event.target.value;
    }

    //选择长租 
    chooseRent(): void{
        this.m_bRent = !this.m_bRent;
    }
}
