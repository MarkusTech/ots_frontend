import { saveAs } from 'file-saver';

export const saveDataAsJSON = (data) => {
  const jsonData = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });
  saveAs(blob, 'data.json');
};