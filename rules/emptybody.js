import { danger, markdown } from 'danger';

console.log('emptybody was loaded');

const getMessage = username => `\
    @${username} We noticed that the body of this issue is blank.

    Please fill in this field with more information to help the \
    maintainers resolve your issue.\
`;

export const emptybody = () => {
  console.log('emptybody was run');

  const { login: username, body } = danger.github.issue;

  if (body.trim().length === 0) {
    markdown(getMessage(username));
  }
};

export default () => {
  emptybody();
};
