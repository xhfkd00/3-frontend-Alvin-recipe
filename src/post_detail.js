import './header.js';
import './footer.js';
import './comment.js';
import { displayImage, postFetch, cookieUserNickname, deleteFetch, patchFetch } from './component.js';
import { loginCheck } from './header.js';

const login = loginCheck();

if (login === false) {
    alert('로그인 후 이용하실 수 있습니다.');
    location.href = '/';
}

let url;
if (document.location.hostname === 'localhost') {
    // 개발모드의 url
    url = 'http://localhost:3000';
} else {
    // 배포모드의 url
    url = 'https://api.reci-p.com';
}

// 게시글 인덱스 번호 가져오는 변수
let id = document.location.pathname.split('/')[2];

// 게시글 인덱스 번호로 데이터베이스 조회
const postData = await postFetch('/posts/view', { id: id });

// 쿠키에 저장된 닉네임으로 유저 인덱스번호 검색 후 변수에 할당
const userData = await postFetch('/users/inquiry', { userNickname: cookieUserNickname });
const userindex = await userData.results[0].id;

// 게시글에 좋아요를 눌렀는지 확인
const checkLike = await postFetch('/posts/check-like', { userindex: userindex, postindex: id });
// 게시글에 좋아요가 몇개인지 확인
const countLike = await postFetch('/posts/count-like', { postindex: id });

const postBox = document.querySelector('#post_box');
const writerBox = document.createElement('div');
const registrationBox = document.createElement('div');
const writer = document.createElement('p');
const registration = document.createElement('p');
const views = document.createElement('p');
const title = document.createElement('p');
const content = document.createElement('div');
const infoBox = document.createElement('div');
const likeBox = document.createElement('div');
const commentBox = document.createElement('div');
const likeIcon = displayImage('../image/heart3.png', '좋아요');
const commentIcon = displayImage('../image/comment2.png', '댓글');
const disLikeIcon = displayImage('../image/blackheart.png', '댓글');
const likeCount = document.createElement('div');
const commentCount = document.createElement('p');
const lineBox = document.createElement('div');
const line = document.createElement('div');
const imageBox = document.querySelector('#profileimage');
const image = displayImage(`${url}${userData.results[0].image}`);

const editBox = document.createElement('div');
const editItem = document.createElement('div');
const editBtn = document.createElement('button');
const deleteBtn = document.createElement('button');

editBox.classList.add('comment_registration_box');
editItem.classList.add('comment_registration_edit_box');
editBtn.classList.add('comment_registration_edit_button');
deleteBtn.classList.add('comment_registration_delete_button');

postBox.classList.add('post_box');
writerBox.classList.add('writer_box');
writer.classList.add('writer_font');
registrationBox.classList.add('registration_box');
registration.classList.add('registration_font');
views.classList.add('registration_font');
title.classList.add('title_font');
content.classList.add('content_textarea');
infoBox.classList.add('info_box');
likeBox.classList.add('count_box');
commentBox.classList.add('count_box');
likeIcon.classList.add('icon');
commentIcon.classList.add('icon');
disLikeIcon.classList.add('icon');
lineBox.classList.add('line_box');
line.classList.add('line');

postBox.append(writerBox);
writerBox.prepend(writer);
writerBox.append(registrationBox);
registrationBox.prepend(registration);
registrationBox.append(views);
writerBox.after(title);
title.after(content);
content.after(infoBox);
infoBox.prepend(likeBox);
infoBox.append(commentBox);
// likeBox.prepend(likeIcon);
likeBox.append(likeCount);
commentBox.prepend(commentIcon);
commentBox.append(commentCount);
commentBox.after(editBox);
postBox.after(lineBox);
lineBox.prepend(line);
imageBox.prepend(image);

editBox.prepend(editItem);
editItem.prepend(editBtn);
editItem.append(deleteBtn);

editBtn.textContent = '수정';
deleteBtn.textContent = '삭제';

writer.textContent = postData.results[0].writer;
registration.textContent = postData.results[0].registration;
views.textContent = `조회수 ${postData.results[0].views}`;

title.textContent = postData.results[0].title;
content.innerHTML = postData.results[0].contents;

likeCount.textContent = `${countLike.length} 개`;
commentCount.textContent = `${postData.results[0].comment} 개`;

if (writer.textContent !== cookieUserNickname) {
    editBox.style.display = 'none';
}

// 좋아요를 안눌렀으면 빈하트
if (checkLike.length == 0) {
    likeBox.prepend(likeIcon);
    likeIcon.id = 'like';
} else {
    // 좋아요를 눌렀으면 검은하트
    likeBox.prepend(disLikeIcon);
    likeIcon.id = 'like';
}

// 게시글 수정
editBtn.addEventListener('click', async function () {
    location.href = `/post/edit/${id}`;
});

// 게시글 삭제
deleteBtn.addEventListener('click', async function () {
    const data = await patchFetch('/posts', { id: id, writer: cookieUserNickname });
    if (data.results.affectedRows == 0) {
        return alert('오류가 발생했습니다. 잠시후에 다시 시도해 주세요.');
    } else {
        alert('게시글 삭제 완료');
        return (location.href = '/');
    }
});

//게시글 좋아요
likeIcon.addEventListener('click', async function () {
    const data = await postFetch('/posts/like', { userindex: userindex, postindex: id });
    if (data.results.affectedRows == 0) {
        return alert('오류가 발생했습니다. 잠시후에 다시 시도해 주세요.');
    } else {
        location.reload();
        return alert('좋아요!');
    }
});

//게시글 좋아요 취소
disLikeIcon.addEventListener('click', async function () {
    const data = await deleteFetch('/posts/like', { userindex: userindex, postindex: id });
    if (data.results.affectedRows == 0) {
        return alert('오류가 발생했습니다. 잠시후에 다시 시도해 주세요.');
    } else {
        location.reload();
        return;
    }
});
