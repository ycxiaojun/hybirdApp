"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var addseller_1 = require("./addseller");
var Seller = /** @class */ (function (_super) {
    __extends(Seller, _super);
    function Seller() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Seller;
}(addseller_1.AddSeller));
exports.Seller = Seller;
//# sourceMappingURL=seller.js.map