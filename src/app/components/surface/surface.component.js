"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var surface_layout_model_1 = require("../../models/surface-layout.model");
var SurfaceComponent = (function () {
    function SurfaceComponent(elementRef) {
        this.elementRef = elementRef;
        this.NUM_COLS = 4;
        this.shouldDisplay = true;
        this.cells = [];
    }
    SurfaceComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.surfaceDisplayStream.subscribe(function (shouldDisplay) {
            _this.shouldDisplay = shouldDisplay;
        });
        this.setupDisplayCells();
    };
    SurfaceComponent.prototype.setupDisplayCells = function () {
        var surfaceHeight = window.innerHeight;
        var surfaceWidth = window.innerWidth;
        var ratio = surfaceWidth / surfaceHeight;
        surfaceWidth * NUM_COLS;
    };
    return SurfaceComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", surface_layout_model_1.SurfaceLayout)
], SurfaceComponent.prototype, "surfaceLayout", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", rxjs_1.Subject)
], SurfaceComponent.prototype, "surfaceDisplayStream", void 0);
SurfaceComponent = __decorate([
    core_1.Component({
        selector: 'surface',
        templateUrl: './surface.component.html',
        styleUrls: ['./surface.component.css']
    }),
    __metadata("design:paramtypes", [core_1.ElementRef])
], SurfaceComponent);
exports.SurfaceComponent = SurfaceComponent;
//# sourceMappingURL=surface.component.js.map