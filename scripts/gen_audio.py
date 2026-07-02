import requests, json, subprocess, os

API_KEY = os.environ.get("MINIMAX_API_KEY", "")
if not API_KEY:
    print("Error: MINIMAX_API_KEY not set")
    exit(1)

text = "我强烈地告诉你，未来两年最值钱的一类人，不是程序员，也不是会用AI工具的人，而是能给企业落地AI的人。大部分人卡在一个误区，以为学几个工具就能接项目，这是最大的坑。我之前有很多学员都踩过，你连工作流上下游节点的注意事项，和外接服务搭建策略都不知道，那你要什么自行车？所以敲黑板，重点来了，真正的企业级AI落地核心思路只有这三点：业务拆解、流程设计、AI接入。有人说，你敢不敢说人话？我敢。先把你家的业务扒开瞅瞅，每个部门天天都干什么？哪些动作最耗人力、最重复的、最让员工抱怨的？拆成最小的节点，能不能用AI代替，该不该用AI代替？第二流程设计，拿个纸，卫生纸也行，画条线。原来信息怎么传，审批怎么走，反馈怎么回？把冗余步骤砍掉，重新设计一条人+AI能跑通的路径，每一步都很清楚，是人干还是AI干。第三步AI接入，哪个环节卡住了就接哪，哪个数据乱成一团就让AI去规整，哪个人工重复劳动就让AI跑起来。不是全交给AI，而是让AI把一部分操作代替，这叫AI赋能。有些人觉得AI万能。AI落地不是说几分钟能说明白的事。如果你不满足打工收入，想靠AI做副业转型，关注我手头有点资料，有AI落地需求给我一脚，到时候咱唠到天荒地老。"

print(f"Text: {len(text)} chars")

resp = requests.post(
    "https://api.minimax.chat/v1/t2a_v2",
    headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"},
    json={
        "model": "speech-2.8-turbo",
        "text": text,
        "voice_setting": {"voice_id": "presenter_male"},
        "audio_setting": {"sample_rate": 32000, "format": "mp3", "speed": 1.0},
    },
    timeout=60,
)

print(f"Status: {resp.status_code}")
data = resp.json()

if "data" in data and "audio" in data["data"]:
    audio_bytes = bytes.fromhex(data["data"]["audio"])
    path = "/home/zehaoli0324/remotion-github/src/WaterfallVideo/data/audio_minimax_v3.mp3"
    with open(path, "wb") as f:
        f.write(audio_bytes)
    r = subprocess.run(
        ["ffprobe", "-v", "quiet", "-print_format", "json", "-show_format", path],
        capture_output=True, text=True,
    )
    dur = float(json.loads(r.stdout)["format"]["duration"])
    print(f"Audio: {dur:.2f}s, {len(audio_bytes)} bytes")
else:
    print(f"Response: {json.dumps(data, ensure_ascii=False)[:500]}")
