import * as csvToJson from 'csvtojson';

import IRow from './IRow';

export const csvToRowsArray = (filePath: string): Promise<IRow[]> => new Promise((resolve) => {
  csvToJson()
    .fromFile(filePath)
    .then((json) => {
      const headers = json.shift();

      const rowsArray = json.map((rawRow) => {
        const row: { [index: string]: Date | number | string | undefined } = {};

        Object.keys(headers).forEach((key) => {
          const col = headers[key];
          const val = rawRow[key];

          if (val === '') {
            row[col] = undefined;
          } else if (col === 'date' || col === 'createdDate' || col === 'changedDate') {
            row[col] = new Date(val);
          } else if (col === 'income' || col === 'outcome') {
            row[col] = parseFloat(val.replace(',', '.'));
          } else {
            row[col] = val;
          }
        });

        return row as any as IRow;
      });

      resolve(rowsArray);
    });
});

export const merge = (arrayOfRowsArrays: IRow[][]): IRow[] => {
  const firstRowsArray = arrayOfRowsArrays.shift() || [];

  return firstRowsArray.concat(...arrayOfRowsArrays);
};
