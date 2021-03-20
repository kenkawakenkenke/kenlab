import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import { blue } from '@material-ui/core/colors';
import { useTranslation } from 'react-i18next';
import { TwitterFollowButton } from 'react-twitter-embed';
import { Trans } from 'react-i18next';

const emails = ['username@gmail.com', 'user02@gmail.com'];
const useStyles = makeStyles({
    root: {
        margin: "8px",
    },
});

function AboutDialog({ onClose, open }) {
    const classes = useStyles();
    const { t } = useTranslation();

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">{t("このページについて")}</DialogTitle>

            <div className={classes.root}>
                <p>
                    <Trans i18nKey="aboutDescription">
                        子供が時計の勉強に苦戦していたため、<a href="https://twitter.com/kenkawakenkenke/status/1372826605244928000" target="_blank">難易度をかえられたら便利ではないかと考えて作りました</a>。
                    </Trans>
                </p>

                <p>
                    <Trans i18nKey="aboutGithub">
                        このページのソースはすべて<a href="https://github.com/kenkawakenkenke/kenlab/blob/main/src/pages/training_clock.js" target="_blank">こちらでオープンソースされています</a>。自由に改変してください。
                    </Trans>
                </p>

                <p>
                    <Trans i18nKey="aboutFollowMe">
                        要望があったり、実際に使ってみた感想をシェアしたり、このページを気に入ったら是非Twitterで作者をフォローしてください：
                    </Trans>
                    <TwitterFollowButton screenName={'kenkawakenkenke'} />
                </p>
            </div>
        </Dialog>
    );
}

AboutDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

export default AboutDialog;
