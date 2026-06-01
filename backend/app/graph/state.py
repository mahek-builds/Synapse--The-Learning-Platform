from typing import TypedDict,List
class AgentState(TypedDict):
    user_query:str
    explaination:str
    quiz:List[str]
    final_response:str
    weak_topics:List[str]
    