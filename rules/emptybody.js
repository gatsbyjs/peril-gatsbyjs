import { danger, markdown } from 'danger';

const getMessage = username => `\
@${username} We noticed that the body of this issue is blank.

Please fill in this field with more information to help the \
maintainers resolve your issue.\
`;

export const emptybody = () => {
  const {
    user: { login: username },
    body
  } = danger.github.issue;

  if (body.trim().length === 0) {
    markdown(getMessage(username));
  }
};

export default () => {
  emptybody();
};
