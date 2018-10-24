import { Component, } from '@angular/core';
import { IonicPage, NavParams, ViewController, NavController } from 'ionic-angular';
import { ThemeService } from '../../service/theme.service';
import { ApiurlService } from '../../service/apiurl.service';
import { AlertService } from '../../service/alert.service';
import { PersonMember } from '../../centerdataclass/personmember';
import { ErrorEnum } from '../../model/enumclasses';
import { ContextService } from '../../service/context.service';
import { I18NPipe } from '../../pipe/I18NPipe';

@IonicPage()
@Component({
    selector: 'page-change-meb-name',
    templateUrl: 'change-meb-name.html',
})
export class ChangeMebNamePage {
    m_objPersonMember: PersonMember = new PersonMember();

    constructor(
        public m_objNavParams: NavParams,
        public m_objThemeService: ThemeService,
        public m_objApiUrlService: ApiurlService,
        public m_objAlertService: AlertService,
        public m_objViewCtrl: ViewController,
        public m_objNavCtrl: NavController,
        public m_objContextService: ContextService,
        private m_objI18NPipe:I18NPipe
    ) {
        this.m_objPersonMember.MebName = this.m_objNavParams.get('MebName');
        this.m_objPersonMember.Sex = this.m_objNavParams.get('Sex');
    }
    changeMebName() {
        if (this.m_objPersonMember.MebName == '') return this.m_objAlertService.tipsAlert(this.m_objI18NPipe.transform("姓名不能为空哦[姓名不能为空哦]"));
        if (this.m_objPersonMember.MebName.length > 60) return this.m_objAlertService.tipsAlert(this.m_objI18NPipe.transform("您的姓名太长了，不能超过[您的姓名太长了，不能超过]")+ 60 + this.m_objI18NPipe.transform("个字符哦[个字符哦]"));
        this.m_objContextService.loadingCreate()
        this.m_objApiUrlService.editMebInfo(this.m_objPersonMember).subscribe(data => {
            this.m_objContextService.loadingClose();
            if (data.Code == ErrorEnum.successfully) {
                this.m_objAlertService.tipsAlert(this.m_objI18NPipe.transform("姓名修改成功[姓名修改成功]"), () => {
                    let data = { 'MebName': this.m_objPersonMember.MebName };
                    this.m_objViewCtrl.dismiss(data);
                })
            } else {
                this.m_objAlertService.tipsAlert(data.Msg);
            }
        })
    }
}
