/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { FocusMonitor } from '@angular/cdk/a11y';
import { ChangeDetectorRef, Component, ElementRef, forwardRef, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BooleanInput, OnChangeType, OnTouchedType } from 'ng-zorro-antd/core/types';
import { InputBoolean } from 'ng-zorro-antd/core/util';

export interface NzCheckBoxOptionInterface {
  label: string;
  value: string;
  checked?: boolean;
  disabled?: boolean;
}

@Component({
  selector: 'nz-checkbox-group',
  exportAs: 'nzCheckboxGroup',
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  template: `
    <label
      nz-checkbox
      class="ant-checkbox-group-item"
      *ngFor="let o of options; trackBy: trackByOption"
      [nzDisabled]="o.disabled || nzDisabled"
      [nzChecked]="o.checked!"
      (nzCheckedChange)="onCheckedChange(o, $event)"
    >
      <span>{{ o.label }}</span>
    </label>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NzCheckboxGroupComponent),
      multi: true
    }
  ],
  host: {
    '[class.ant-checkbox-group]': 'true'
  }
})
export class NzCheckboxGroupComponent implements ControlValueAccessor, OnInit, OnDestroy {
  static ngAcceptInputType_nzDisabled: BooleanInput;

  onChange: OnChangeType = () => {};
  onTouched: OnTouchedType = () => {};
  options: NzCheckBoxOptionInterface[] = [];
  @Input() @InputBoolean() nzDisabled = false;

  trackByOption(_: number, option: NzCheckBoxOptionInterface): string {
    return option.value;
  }

  onCheckedChange(option: NzCheckBoxOptionInterface, checked: boolean): void {
    option.checked = checked;
    this.onChange(this.options);
  }

  constructor(private elementRef: ElementRef, private focusMonitor: FocusMonitor, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.focusMonitor.monitor(this.elementRef, true).subscribe(focusOrigin => {
      if (!focusOrigin) {
        Promise.resolve().then(() => this.onTouched());
      }
    });
  }

  ngOnDestroy(): void {
    this.focusMonitor.stopMonitoring(this.elementRef);
  }

  writeValue(value: NzCheckBoxOptionInterface[]): void {
    this.options = value;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: OnChangeType): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.nzDisabled = disabled;
    this.cdr.markForCheck();
  }
}
