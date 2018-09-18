export const fontSaira = { fontFamily: "'Saira', sans-serif" };

export const InputAppend = Object.assign({}, { backgroundColor: '#f4f4f4', border: 0 }, fontSaira);
export const InputAppendDark = Object.assign({}, InputAppend, { backgroundColor: '#e4e4e4' });
export const InputAppendWrong = Object.assign({}, InputAppend, { backgroundColor: '#e0a3a3' });
export const InputAppendCorrect = Object.assign({}, InputAppend, { backgroundColor: '#aad4a3' });

export const Input = Object.assign({}, { backgroundColor: '#ffffff', border: 0, boxShadow: 'none' }, fontSaira);
export const InputDark = Object.assign({}, Input, { backgroundColor: '#f4f4f4' });
export const InputWrong = Object.assign({}, Input, { backgroundColor: '#ffc4c4' });
export const InputCorrect = Object.assign({}, Input, { backgroundColor: '#ccffc4' });

export const InputDropdown = { borderColor: 'white' };

export const InputGroup = { borderRadius: '0.3125rem', boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)' };

export const RoundButton = { marginRight: '0.5rem', padding: '0.375rem', borderRadius: '10000px' };

export default {
  fontSaira,
  InputAppend,
  InputAppendDark,
  InputAppendWrong,
  InputAppendCorrect,
  Input,
  InputDark,
  InputWrong,
  InputCorrect,
  InputGroup,
  RoundButton,
};
