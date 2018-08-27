import { danger, markdown } from 'danger';

const getMessage = username => `\
@${username} We noticed that the body of this issue is blank.

Please fill in this field with more information to help the \
maintainers resolve your issue.\
`;

export const emptybody = () => {
  const { login, body } = danger.github.issue;

  if (body.trim().length === 0) {
    markdown(getMessage(login));
  }
};

export default () => {
  emptybody();
};
