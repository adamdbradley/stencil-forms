import { createStore } from '@stencil/store';
import { getRenderingRef } from '@stencil/core';
export const state = {
    /**
     * Unique id incrementer
     */
    i: 0,
    /**
     * last rendering ref
     */
    r: null,
};
export const ctrlElmIds = /*@__PURE__*/ new WeakMap();
export const ctrlElms = /*@__PURE__*/ new WeakMap();
/**
 * Follows LabellingType index
 */
export const labellingElms = [
    new WeakMap(),
    new WeakMap(),
    new WeakMap(),
];
export const ctrlChildren = /*@__PURE__*/ new WeakMap();
export const ctrls = /*@__PURE__*/ new WeakMap();
export const ctrlDatas = /*@__PURE__*/ new WeakMap();
export const inputDebounces = /*@__PURE__*/ new WeakMap();
export const InstanceId = /*@__PURE__*/ Symbol();
const CurrentControlIndex = /*@__PURE__*/ Symbol();
export const Control = /*@__PURE__*/ Symbol();
const ControlStates = /*@__PURE__*/ Symbol();
export const setControlState = (ctrlData) => {
    const renderingRef = getRenderingRef();
    const ctrlStates = (renderingRef[ControlStates] = renderingRef[ControlStates] || []);
    if (state.r !== renderingRef) {
        state.r = renderingRef;
        ctrlData.x = renderingRef[CurrentControlIndex] = 0;
    }
    else {
        ctrlData.x = ++renderingRef[CurrentControlIndex];
    }
    if (ctrlData.x === ctrlStates.length) {
        ctrlStates.push(createStore({
            d: false,
            t: false,
            i: true,
            v: '',
            e: '',
            c: 0,
        }).state);
    }
    return ctrlStates[ctrlData.x];
};
export const getControlState = (ctrl) => {
    let renderingRef = getRenderingRef();
    let ctrlData;
    let ctrlStates;
    let ctrlElm;
    let ctrlState;
    if (renderingRef) {
        ctrlData = ctrlDatas.get(ctrl);
        if (ctrlData) {
            ctrlStates = renderingRef[ControlStates];
            if (ctrlStates) {
                ctrlState = ctrlStates[ctrlData.x];
                if (ctrlState) {
                    return ctrlState;
                }
            }
        }
    }
    ctrlElm = ctrlElms.get(ctrl);
    return ctrlElm ? ctrlElm[Control] : {};
};
