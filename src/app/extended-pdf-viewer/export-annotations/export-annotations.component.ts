import { FreeTextEditorAnnotation, IPDFViewerApplication, InkEditorAnnotation, NgxExtendedPdfViewerService, pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { Component, OnInit } from '@angular/core';
import { isLocalhost } from '../common/utilities';

@Component({
  selector: 'app-export-annotations',
  templateUrl: './export-annotations.component.html',
  styleUrls: ['./export-annotations.component.css'],
})
export class ExportAnnotationsComponent {
  public imageDataURL: string | undefined = undefined;

  public selectedTabIndex = 0;

  public isLocalhost = isLocalhost();

  private _fullscreen = false;

  public rawAnnotations: Array<any> | null = null;

  public get fullscreen(): boolean {
    return this._fullscreen;
  }

  public set fullscreen(full: boolean) {
    this._fullscreen = full;
    setTimeout(() => this.pdfViewerService.recalculateSize());
  }

  constructor(private pdfViewerService: NgxExtendedPdfViewerService) {
    pdfDefaultOptions.textLayerMode = 1;
  }

  public exportAnnotations(): void {
    this.selectedTabIndex = 4;
    this.rawAnnotations = this.pdfViewerService.getSerializedAnnotations();
  }

  public addTextEditor(): void {
    const textEditorAnnotation: FreeTextEditorAnnotation = {
      annotationType: 3,
      color: [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)],
      fontSize: Math.random() * 10 + 20,
      value: 'Hello world!',
      pageIndex: 0,
      rect: [
        50, // height?
        Math.random() * 500 + 350, // y
        Math.random() * 400, // x
        100, // width?
      ],
      rotation: 0,
    };
    this.pdfViewerService.addEditorAnnotation(textEditorAnnotation);
  }

  public addDrawing(): void {
    const x = 400 * Math.random();
    const y = 350 + 500 * Math.random();
    const drawing: InkEditorAnnotation = {
      annotationType: 15,
      color: [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)],
      thickness: Math.random() * 10,
      opacity: 1,
      paths: [
        {
          bezier: [x + 0.5, y, x + 0.5, y + 44, x + 44, y + 66, x + 88, y + 44],
          points: [x + 0.5, y, x + 0.5, y + 44],
        },
      ],
      pageIndex: 0,
      rect: [x, y, x + 100, y + 66],
      rotation: 0,
    };
    this.pdfViewerService.addEditorAnnotation(drawing);
  }

  public removeEditors(): void {
    this.pdfViewerService.removeEditorAnnotations();
  }

  public removeTextEditors(): void {
    const filter = (serial: any) => serial?.annotationType === 3;
    this.pdfViewerService.removeEditorAnnotations(filter);
  }

  public removeDrawingEditors(): void {
    const filter = (serial: any) => serial?.annotationType === 15;
    this.pdfViewerService.removeEditorAnnotations(filter);
  }

  public updateAnnotation(index: number, event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    if (this.rawAnnotations) {
      const value = textarea.value.replace(/\n/g, '');
      debugger;
      this.rawAnnotations[index] = JSON.parse(value);

      this.removeEditors();
      for (const annotation of this.rawAnnotations) {
        this.pdfViewerService.addEditorAnnotation(annotation);
      }
    }
  }
}
