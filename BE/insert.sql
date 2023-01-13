SELECT * FROM appmusic.user;

INSERT INTO appmusic.user (`id`, `email`, `first_name`, `last_name`, `password`, `phone`, `photo_url`, `username`)
VALUES ('1', 'huyhoanganh142000@gmail.com', 'Nguyễn Huy', 'Hoàng Anh'
, '$2a$10$NlqXqWaio/siuATac4nInOVokq7.mOtXVoPmBWEjRrwBDM0c8pW7C', '973286269', 'no_url', 'huyhoanganh');
/* username: huyhoanganh  password: 1*/

INSERT INTO appmusic.role (`id`, `role_name`)
VALUES ('1', 'ROLE_ADMIN');

INSERT INTO appmusic.role (`id`, `role_name`)
VALUES ('2', 'ROLE_ADMIN');

INSERT INTO appmusic.users_roles (`user_id`, `role_id`)
VALUES ('1', '1');

INSERT INTO appmusic.users_roles (`user_id`, `role_id`)
VALUES ('1', '2');