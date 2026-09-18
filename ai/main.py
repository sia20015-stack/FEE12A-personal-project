from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

import google.generativeai as genai

from dotenv import load_dotenv
import os
import json
import re


# pip install fastapi uvicorn google-generativeai python-dotenv (설치)
# pip install --upgrade google-generativeai
# uvicorn main:app --reload (실행)


# py -m pip install fastapi uvicorn google-generativeai python-dotenv
# py -m uvicorn main:app --reload


load_dotenv()

app = FastAPI()

# 리액트 연결 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Gemini 설정
genai.configure(
    api_key = os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel("gemini-3.6-flash")

class PaletteRequest(BaseModel):
    content: str

@app.post("/palette")
async def palette(req: PaletteRequest):

    prompt = f"""
    다음 글의 감정을 분석해서
    어울리는 HEX 색상 3개를 추천해줘!

    - 반드시 JSON 배열만 반환
    - 예시 색상을 따라하지 말 것
    - 매번 새로운 색상 조합 생성
    예시:
    ["#FFD6DE", "#FFF1A8", "#C2F0FC"]

    글:
    {req.content}
    """

    response = model.generate_content(prompt)

    text = response.text

    # JSON만 뽑기
    match = re.search(r"\[.*\]", text, re.S)

    if not match:
        return {"colors": ["#000000", "#111111", "#222222"]}

    colors = json.loads(match.group())

    return{
        "colors": colors
    }
