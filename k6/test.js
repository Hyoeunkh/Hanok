import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
    vus: 10,        // 가상 유저 10명
    duration: '30s', // 30초 동안
};

export default function () {
    http.get('http://j14d105.p.ssafy.io:8080/api/v1/streams?page=0&size=10');
    sleep(1);
}