import { PivotView, IDataSet, CalculatedField, FieldList , Toolbar} from '@syncfusion/ej2-pivotview';
import { pivotData } from './datasource';

PivotView.Inject(CalculatedField, FieldList, Toolbar);
let pivotTableObj: PivotView = new PivotView({
        dataSourceSettings: {
            columns: [{ name: 'Date', caption: 'Date' }, { name: 'Product' }],
            dataSource: pivotData as IDataSet[],
            expandAll: false,
            enableSorting: true,
            filters: [],
            drilledMembers: [{ name: 'Country', items: ['France'] }],
            formatSettings: [{ name: 'Amount', format: 'C0' }],
            rows: [{ name: 'Country' }, { name: 'State' }],
            values: [{ name: 'Amount', caption: 'Sold Amount' }, { name: 'Quantity', caption: 'Quantity' }],
            calculatedFieldSettings: [{ name: 'Total', formula: '"Sum(Amount)"+"Sum(Sold)"' }]
    },
    toolbarTemplate: '#template',
     showToolbar: true,
      height: 350,
      dataBound: function ondataBound(): void {
        const dataSource = JSON.parse(pivotTableObj.getPersistData()).dataSourceSettings;
        const saveLink = document.getElementById('save') as HTMLAnchorElement;
        const mimeType = 'application/octet-stream';
        saveLink.setAttribute('download', 'pivot.JSON');
        saveLink.href = 'data:' + mimeType + ';base64,' + btoa(JSON.stringify(dataSource) || '');
        document.getElementById('files')?.addEventListener('change', readBlob, false);
      }
    });

    function readBlob(this: HTMLInputElement, event: Event): void {
      const files = this.files;
      const file = files ? files[0] : undefined;
      if (file) {
        const reader = new FileReader();
        reader.onloadend = function(evt: ProgressEvent<FileReader>): void {
          if (evt.target?.readyState === FileReader.DONE) {
            pivotTableObj.dataSourceSettings = JSON.parse(evt.target.result as string);
          }
        };
        reader.readAsText(file); // Read file as text
      }
      this.value = ''; // Clear the file input
    }
    
pivotTableObj.appendTo('#PivotTable');



