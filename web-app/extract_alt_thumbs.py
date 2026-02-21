import cv2
import os

video_path = 'public/videos/portfolio/Rádio Popular - AirFryer Pizza Pro.mov'
imgs_path = 'public/images/portfolio'

cap = cv2.VideoCapture(video_path)
fps = cap.get(cv2.CAP_PROP_FPS)

# time in seconds
times = [1, 2, 3, 4]
for t in times:
    frame_no = int(t * fps)
    cap.set(cv2.CAP_PROP_POS_FRAMES, frame_no)
    ret, frame = cap.read()
    if ret:
        out_path = os.path.join(imgs_path, f'thumb_airfryer_alt_{t}s.jpg')
        cv2.imwrite(out_path, frame)
        print(f'Thumbnail saved: {out_path}')
    else:
        print(f'Failed to extract frame at {t}s')
cap.release()
