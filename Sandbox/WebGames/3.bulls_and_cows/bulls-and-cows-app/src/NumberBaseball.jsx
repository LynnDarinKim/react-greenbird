import React, { Component }  from 'react';
import Try from './Try';

const getNumbers = () => { // 숫자 네개를 랜덤하게 뽑는 함수. 
  const candidate = [1,2,3,4,5,6,7,8,9];
  const array = [];
  for (let i = 0; i < 4; i += 1) {
    const chosen = candidate.splice(Math.floor(Math.random() * (9 - i)), 1)[0];
    array.push(chosen);
  }
  return array;
}


class NumberBaseball extends Component {
  state = {
    result: "",
    value: "",
    answer: getNumbers(),
    tries: [], // 리액트에서는 push 쓰면 안돼요
  };

  onSubmitForm = (e) => {
    e.preventDefault();
    if(this.state.value === this.state.answer.join('')) {
      this.setState({
        result: '홈런!',
        tries: [...this.state.tries, {try: this.state.value, result: '홈런!'}]
      })
      alert("게임을 다시 시작합니다!");
      this.setState({
        value: "",
        answer: getNumbers(),
        tries: []
      });
    } else { // 답 틀렸으면
      const answerArray = this.state.value.split('').map((v) => parseInt(v));
      let strike = 0;
      let ball = 0;
      if (this.state.tries.length >=9 ) { // 10번 이상 틀렸을 때. 
        this.setState({
          result: `10번 넘게 틀려서 실패! 답은 ${this.state.answer.join(',')} 였습니다!`
        });
        alert('게임을 다시 시작합니다!');
        this.setState({   // 게임 초기화
          value: '',
          answer: getNumbers(),
          tries: [],
        })
      } else {
        for(let i = 0; i < 4; i += 1) { // 몇 볼 몇 스트라이크인지 알려주기
          if(answerArray[i] === this.state.answer[i]) {
            strike += 1;
          } else if(this.state.answer.includes(answerArray[i])) {
            ball += 1;
          }
        }
        this.setState({ // 기회 더주기
          tries: [...this.state.tries, {try: this.state.value, result:`${strike} 스트라이크, ${ball} 볼입니다`}],
          value: '',
        });
      }
    }
    console.log(this.state.value);
    
  };

  onChangeInput = (e) => {
    this.setState({
      value: e.target.value
    })
  };

  render() {
    return (
      <>
        <h1>{this.state.result} </h1>
        <form onSubmit={this.onSubmitForm}>
          <input
            maxLength={4}
            value={this.state.value}
            onChange={this.onChangeInput}
          />
          <button>Submit</button>
        </form>
        <div>시도: {this.state.tries.length} </div>
        <ul>
        {this.state.tries.map((v, i) => {
          return (
            // v 는 매번 새로 넣어주는 객체 {try: this.state.value, result:`${strike} 스트라이트, ${ball} 볼입니다`}이것
            <Try key={`${i+1}차 시도: `} tryInfo={v} index={i} />
          );
        })}
        </ul>
      </>
    );
  }
}

export default NumberBaseball;