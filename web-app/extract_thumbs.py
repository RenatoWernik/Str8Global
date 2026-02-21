import cv2
import os
import glob

vids_path = 'public/videos/portfolio'
imgs_path = 'public/images/portfolio'

videos = glob.glob(os.path.join(vids_path, '*.*'))
for v in videos:
    if v.endswith(('.mp4', '.mov')):
        filename = os.path.basename(v)
        name, _ = os.path.splitext(filename)
        
        cap = cv2.VideoCapture(v)
        # get middle frame
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        if total_frames > 0:
            cap.set(cv2.CAP_PROP_POS_FRAMES, total_frames // 2)
        
        ret, frame = cap.read()
        if ret:
            out_path = os.path.join(imgs_path, f'thumb_{name}.jpg')
            cv2.imwrite(out_path, frame)
            print(f'Thumbnail saved: {out_path}')
        else:
            print(f'Failed to extract frame for {v}')
        cap.release()
