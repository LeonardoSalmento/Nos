import bcrypt from 'bcryptjs';
import User from '../models/User';
import Invitation from '../models/Invitation';

class UserController {
    async index(req, res){
        try {
            const users = await User.find();
            return res.json(users);
            
        } catch (error) {
            return res.status(400).json({error: "Something it's wrong, try again!"});
        }
    }

    async show(req, res){
        try {
            const { id } = req.params;
            const user = await User.findOne({_id:id});
    
            return res.json(user);
        } catch (error) {
            return res.status(404).json({error: "User not found!"});
        }

    }

    async create(req, res){
        try {
            const { first_name, last_name, phone, email, password } = req.body;
            const contacts = []
            const blocked_contacts = []
            const profile_picture = '';
            const created = new Date();
            const updated = new Date();
    
            let user = await User.findOne({ email });
    
            if (user){
                return res.status(409).json({ error: 'User already exists' });
            }
    
            const passwordHash = await bcrypt.hash(password, 8);
    
            user = await User.create({
                first_name,
                last_name,
                phone,
                email,
                password: passwordHash,
                contacts,
                blocked_contacts,
                profile_picture,
                created,
                updated
            });
    
            delete user.password;
    
            return res.json(user);
            
        } catch (error) {
            return res.status(400).json({error: "Please, verify all the fields"});
        }

    }

    async sendInvite(req, res){
        try{
            const { ids } = req.params;

            let arrayIds = ids.split('+');
            const inviterId = arrayIds[0]
            const inviteeId = arrayIds[1]
            
            let invitation = await Invitation.findOne({ inviter: inviterId, invitee: inviteeId });

            if (invitation){
                return res.status(409).json({ error: 'Invitation already exists' });
            }
            const userInviter = await User.findOne({_id:inviterId});

            if(userInviter.contacts.includes(inviteeId)){
                return res.status(409).json({ error: 'You are already friend with that person' });
            }

            for (let i=0; i<userInviter.contacts.length;i++){
                if (String(userInviter.contacts[i]._id)===String(inviteeId)){
                    return res.status(409).json({ error: 'You are already friend with that person' });
                }
            }

            invitation = await Invitation.create({
                inviter: inviterId,
                invitee: inviteeId
            })

            return res.json(invitation);
            
        } catch (error) {
            return res.status(400).json({error: "Something it's wrong, try again!"});
        }

    }

    async seeInvites(req, res){
        try{
            const invitations = await Invitation.find();
            return res.json(invitations);

        } catch (error) {
            return res.status(400).json({error: "Something it's wrong, try again!"});
        }
    }

    async cancelInvite(req, res){
        try{
            const {id} = req.params;
            await Invitation.findByIdAndRemove(id);

            return res.status(200).json("Deleted!");
        } catch (error) {
            return res.status(400).json({error: "Something it's wrong, try again!"});
        }
    }

    async refuseInvite(req, res){
        try{
            const {id} = req.params;
            await Invitation.findByIdAndRemove(id);

            return res.status(200).json("Deleted!");
        } catch (error) {
            return res.status(400).json({error: "Something it's wrong, try again!"});
        }
    }

    async confirmInvite(req, res){
        try{
            const {id} = req.params;
            const invitation = await Invitation.findById({_id:id});
            const {inviter, invitee} = invitation;

            let userInviter = await User.findById({_id:inviter});
            let userInvitee = await User.findById({_id:invitee});

            userInviter.contacts.push({_id:invitee._id, name: (userInvitee.first_name + " " + userInvitee.last_name), profile_picture:invitee.profile_picture});
            userInvitee.contacts.push({_id:inviter._id, name: (userInviter.first_name + " " + userInviter.last_name), profile_picture:inviter.profile_picture});
            await userInvitee.save();
            await userInviter.save();
            await Invitation.findByIdAndRemove(id);

            return res.status(200).json("You have a new friend!");
        } catch (error) {
            return res.status(400).json({error: "Something it's wrong, try again!"});
        }
    }

    async brokenFriendship(req, res){
        try{
            const { ids } = req.params;

            let arrayIds = ids.split('+');
            const userId = arrayIds[0]
            const contactId = arrayIds[1]

            const user = await User.findOne({_id:userId});
            const contact = await User.findOne({_id:contactId});
  
            let userIndex = user.contacts.indexOf(contactId);
            user.contacts.splice(userIndex, 1);
            
            let contactIndex = contact.contacts.indexOf(userId);
            contact.contacts.splice(contactIndex, 1);


            await user.save();
            await contact.save();

            return res.status(200).json("broken friendship!");
        } catch (error) {
            return res.status(400).json({error: "Something it's wrong, try again!"});
        }
    }

    async showAllFriends(req, res){
        try{
            const { id } = req.params;

            const user = await User.findById({_id:id});

            return res.status(200).json(user.contacts);
        } catch (error) {
            return res.status(400).json({error: "Something it's wrong, try again!"});
        }
    }

    async block(req, res){
        try{
            const { ids } = req.params;
            
            let arrayIds = ids.split('+');
            const blockerId = arrayIds[0]
            const blockedId = arrayIds[1]

            let blocker = await User.findById({_id:blockerId});
            let blocked = await User.findById({_id:blockedId});

            for (let i=0; i< blocker.blocked_contacts.length;i++){
                if(String(blocker.blocked_contacts[i]._id)===String(blockedId)){
                    return res.status(400).json({error: "This person is already in your block list"});
                }
            }

            for (let i=0; i< blocker.contacts.length;i++){
                if(String(blocker.contacts[i]._id)===String(blockedId)){
                    const blockedIndex = blocker.contacts.indexOf(blockedId);
                    blocker.contacts.splice(blockedIndex, 1);

                    const blockerIndex = blocked.contacts.indexOf(blockerId);
                    blocked.contacts.splice(blockerIndex, 1);
                    break;
                }
            }

            blocker.blocked_contacts.push({_id:blocked._id, name: (blocked.first_name + " " + blocked.last_name), profile_picture:blocked.profile_picture});
            await blocker.save();
            await blocked.save();

            return res.status(200).json(blocker);
        } catch (error) {
            return res.status(400).json({error: "Something it's wrong, try again!"});
        }
    }


    async unblock(req, res){
        try{
            const { ids } = req.params;
            
            let arrayIds = ids.split('+');
            const blockerId = arrayIds[0]
            const blockedId = arrayIds[1]

            let blocker = await User.findById({_id:blockerId});

            if (!blocker){
                return res.status(404).json({error: "User not found!"});
            }

            const blockerIndex = blocker.blocked_contacts.indexOf(blockedId);
            blocker.blocked_contacts.splice(blockerIndex, 1);
            await blocker.save();

            return res.status(200).json(blocker);

        } catch (error) {
            return res.status(400).json({error: "Something it's wrong, try again!"});
        }
    }


    async showAllBlocks(req, res){
        try{
            const { id } = req.params;

            const user = await User.findById({_id:id});

            return res.status(200).json(user.blocked_contacts);
        } catch (error) {
            return res.status(400).json({error: "Something it's wrong, try again!"});
        }
    }

}

export default UserController;