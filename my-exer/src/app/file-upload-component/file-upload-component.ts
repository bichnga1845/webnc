import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-file-upload-component',
  standalone: false,
  templateUrl: './file-upload-component.html',
  styleUrl: './file-upload-component.css',
})
export class FileUploadComponent {
@Input()
requiredFileType:any;
fileName = '';
uploadProgress:number=0;
uploadSub: Subscription=new Subscription();
uploadedImageUrl: string = ''; // URL của ảnh đã upload
uploadSuccess: boolean = false; // Flag để hiển thị thông báo
previewImageUrl: string = ''; // URL preview trước khi upload

constructor(private http: HttpClient) {}
onFileSelected(event:any) {
const file:File = event.target.files[0];
if (file) {
this.fileName = file.name;
this.uploadSuccess = false; // Reset flag

// Preview ảnh ngay lập tức
const reader = new FileReader();
reader.onload = (e: any) => {
  this.previewImageUrl = e.target.result;
};
reader.readAsDataURL(file);

const formData = new FormData();
formData.append("image", file);
const upload$ = this.http.post("http://localhost:3001/upload", formData, {
reportProgress: true,
observe: 'events',
responseType: 'text'
})
.pipe(
finalize(() => this.reset())
);
this.uploadSub = upload$.subscribe(event => {
if (event.type == HttpEventType.UploadProgress) {
this.uploadProgress = Math.round(100 * (event.loaded /
event.total!));
}
if (event.type == HttpEventType.Response) {
// Upload thành công
this.uploadSuccess = true;
this.uploadedImageUrl = `http://localhost:3001/image/${this.fileName}`;
console.log('Upload success! Image URL:', this.uploadedImageUrl);
}
})
}
}
cancelUpload() {
this.uploadSub.unsubscribe();
this.reset();
}
reset() {
this.uploadProgress = 0;
this.uploadSub = new Subscription();
// Không reset uploadSuccess và uploadedImageUrl để giữ ảnh hiển thị
}
}
