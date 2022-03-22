export type estType={
    massSpectrum:{x:number[],y:number[]},
    curve:{x:number[],y:number[]},
    peakTimePostion:number,
    peakTimeIndex:number,
    componentMz:number[],
}

export type peakType={
    mz:number,
    intensity:number,
}

export type nistDataType={
    peaklist:peakType[],
    scanTime:number,
}

export type nistResultType={
    name:string,
    MF:number,
    RMF:number,
    pro:number,
    formula:string,
    CAS:string,
}

export type componentNistResultType={
    RT:number,
    nistResult:nistResultType[],

}