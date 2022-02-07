declare type Options = {
    output?: string;
    validityDurationYears?: string;
    commonName?: string;
};
export declare function generateCodeSigningAsync(projectRoot: string, { output, validityDurationYears: validityDurationYearsString, commonName }: Options): Promise<void>;
export {};
