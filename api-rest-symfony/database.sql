CREATE DATABASE IF NOT EXISTS api_rest_symfony;
USE api_rest_symfony;

CREATE TABLE users(
	id 				int(255) auto_increment not null,
	name			varchar(50) NOT NULL,
	surname			varchar(100),
	email			varchar(255) NOT NULL,
	password		varchar(255) NOT NULL,
	role			varchar(20),	
	created_at		datetime DEFAULT CURRENT_TIMESTAMP,
	updated_at		datetime DEFAULT CURRENT_TIMESTAMP,	
	CONSTRAINT pk_users PRIMARY KEY(id)
) ENGINE=InnoDb; 

CREATE TABLE video(
	id 				int(255) auto_increment not null,
	user_id			int(255) NOT NULL,	
	title           varchar(255) NOT NULL,
	description 	text,
	url 			varchar(255) NOT NULL,
	status 			varchar(50),
	created_at		datetime DEFAULT CURRENT_TIMESTAMP,
	updated_at		datetime DEFAULT CURRENT_TIMESTAMP,	
	CONSTRAINT pk_videos PRIMARY KEY(id),
	CONSTRAINT fk_video_user FOREIGN KEY(user_id) REFERENCES users(id),
) ENGINE=InnoDb;